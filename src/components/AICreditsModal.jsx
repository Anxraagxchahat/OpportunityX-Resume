import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Sparkles, History, ShieldCheck, Zap, Copy, Check, ExternalLink,
  Users, Gift, AlertCircle, Share2, Link as LinkIcon, RefreshCw, Loader2
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { apiService } from '../services/api';
import {
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YoutubeIcon
} from './icons/BrandIcons';
import {
  getReferralShareUrl,
  shareReferral,
  isValidReferralCode,
  normalizeReferralCode
} from '../utils/referralAttribution';

export const AICreditsModal = ({ isOpen, onClose }) => {
  const {
    isAICreditsModalOpen,
    setIsAICreditsModalOpen,
    aiCredits,
    setAiCredits,
    session,
    setIsUnlockAIModalOpen,
    setIsBuyCreditsModalOpen
  } = useResume();

  const active = isOpen !== undefined ? isOpen : isAICreditsModalOpen;
  const handleClose = onClose || (() => setIsAICreditsModalOpen(false));

  const [rewardsData, setRewardsData] = useState(null);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);
  const [rewardsError, setRewardsError] = useState(null);

  const [copyStatus, setCopyStatus] = useState(null); // 'code' | 'link' | 'share' | null
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [isRedeemingReferral, setIsRedeemingReferral] = useState(false);
  const [referralMessage, setReferralMessage] = useState({ text: '', isError: false });

  const [claimingTaskId, setClaimingTaskId] = useState(null);
  const [socialMessage, setSocialMessage] = useState({ text: '', isError: false });

  const { remaining = 0, totalPurchased = 0, usageHistory = [] } = aiCredits;
  const totalUsed = usageHistory.reduce((acc, curr) => acc + (curr.creditsUsed || 0), 0);
  const isLoggedIn = session.isAuthenticated && !session.isGuest;

  // Load rewards overview whenever modal opens
  const fetchRewards = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoadingRewards(true);
    setRewardsError(null);
    try {
      const data = await apiService.getRewardsOverview();
      if (data) {
        setRewardsData(data);
        if (typeof data.remaining_credits === 'number') {
          setAiCredits(prev => ({
            ...prev,
            remaining: data.remaining_credits
          }));
        }
      }
    } catch (err) {
      console.warn('[Rewards] Failed to fetch rewards overview:', err.message);
      setRewardsError(err.message || 'Unable to load referral profile.');
    } finally {
      setIsLoadingRewards(false);
    }
  }, [isLoggedIn, setAiCredits]);

  useEffect(() => {
    if (active && isLoggedIn) {
      fetchRewards();
    }
  }, [active, isLoggedIn, fetchRewards]);

  if (!active) return null;

  // Copy Referral Code
  const handleCopyCode = async (code) => {
    if (!code) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopyStatus('code');
        setTimeout(() => setCopyStatus(null), 2200);
      }
    } catch (e) {
      console.warn('Failed to copy code:', e);
    }
  };

  // Copy Referral Link
  const handleCopyLink = async (code) => {
    if (!code) return;
    const url = getReferralShareUrl(code);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopyStatus('link');
        setTimeout(() => setCopyStatus(null), 2200);
      }
    } catch (e) {
      console.warn('Failed to copy link:', e);
    }
  };

  // Native Share Referral
  const handleShareReferral = async (code) => {
    if (!code) return;
    const result = await shareReferral(code);
    if (result.success) {
      if (result.method === 'copy') {
        setCopyStatus('link');
        setTimeout(() => setCopyStatus(null), 2200);
      } else {
        setCopyStatus('share');
        setTimeout(() => setCopyStatus(null), 2200);
      }
    }
  };

  // Manual Referral Code Redemption
  const handleApplyReferral = async (e) => {
    e.preventDefault();
    const cleanCode = normalizeReferralCode(inputReferralCode);
    if (!isValidReferralCode(cleanCode)) {
      setReferralMessage({ text: 'Referral code must be exactly 6 uppercase letters (A-Z).', isError: true });
      return;
    }

    setIsRedeemingReferral(true);
    setReferralMessage({ text: '', isError: false });

    try {
      const res = await apiService.redeemReferralCode(cleanCode);
      if (res && res.ok) {
        setReferralMessage({ text: res.message || `Referral applied! +${res.credits_added} credits added.`, isError: false });
        setInputReferralCode('');
        if (typeof res.remaining_credits === 'number') {
          setAiCredits(prev => ({ ...prev, remaining: res.remaining_credits }));
        }
        await fetchRewards();
      }
    } catch (err) {
      setReferralMessage({ text: err.message || 'Failed to apply referral code.', isError: true });
    } finally {
      setIsRedeemingReferral(false);
    }
  };

  // Social Task Claim
  const handleClaimSocial = async (task) => {
    if (task.completed) return;

    if (task.official_url) {
      window.open(task.official_url, '_blank', 'noopener,noreferrer');
    }

    setClaimingTaskId(task.task_id);
    setSocialMessage({ text: '', isError: false });

    try {
      const res = await apiService.claimSocialReward(task.task_id);
      if (res && res.ok) {
        setSocialMessage({ text: res.message || `+${res.credits_added} credits claimed!`, isError: false });
        if (typeof res.remaining_credits === 'number') {
          setAiCredits(prev => ({ ...prev, remaining: res.remaining_credits }));
        }
        await fetchRewards();
      } else if (res && res.message) {
        setSocialMessage({ text: res.message, isError: false });
      }
    } catch (err) {
      setSocialMessage({ text: err.message || 'Failed to claim social reward.', isError: true });
    } finally {
      setClaimingTaskId(null);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram': return <InstagramIcon className="w-4 h-4 text-[#E4405F]" />;
      case 'linkedin': return <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />;
      case 'x': return <XIcon className="w-3.5 h-3.5 text-white" />;
      case 'youtube': return <YoutubeIcon className="w-4 h-4 text-[#FF0000]" />;
      default: return <Sparkles className="w-4 h-4 text-orange-400" />;
    }
  };

  const socialTasks = rewardsData?.social_tasks || [
    { task_id: 'instagram_follow', platform: 'Instagram', action: 'Follow OpportunityX', official_url: 'https://www.instagram.com/theopportunityx/', reward_amount: 2, completed: false },
    { task_id: 'linkedin_follow', platform: 'LinkedIn', action: 'Follow OpportunityX', official_url: 'https://www.linkedin.com/company/128134073', reward_amount: 1, completed: false },
    { task_id: 'x_follow', platform: 'X', action: 'Follow OpportunityX', official_url: 'https://x.com/TheOpportunityX', reward_amount: 1, completed: false },
    { task_id: 'youtube_subscribe', platform: 'YouTube', action: 'Subscribe to OpportunityX', official_url: 'https://www.youtube.com/@theopportunityX', reward_amount: 1, completed: false }
  ];

  const socialBonusEarned = rewardsData?.social_bonus_earned || 0;
  const userReferralCode = rewardsData?.referral_profile?.referral_code || '';
  const hasRedeemedReferral = rewardsData?.referral_profile?.has_redeemed || false;
  const redeemedCode = rewardsData?.referral_profile?.redeemed_code || '';
  const successfulReferrals = rewardsData?.referral_profile?.successful_referrals || 0;
  const referralCreditsEarned = rewardsData?.referral_profile?.referral_credits_earned || 0;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-orange-500/30 rounded-2xl w-full max-w-xl shadow-2xl p-4 sm:p-6 space-y-4 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close Credits Center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-10">
          <div className="relative p-1 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
            <img
              src="/favicon.png"
              alt="OpportunityX Logo"
              className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 items-center justify-center text-white font-black text-sm shadow-md">
              OX
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-orange-500 text-black border border-[#0B0D14] shadow-md">
              <Sparkles className="w-3 h-3 animate-pulse" />
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-xl font-black text-white truncate">✨ AI Credits & Rewards Center</h3>
            <p className="text-xs text-slate-400 truncate">
              {isLoggedIn
                ? `Account: ${session.user?.email || 'Authenticated User'}`
                : 'Guest Session — Login to unlock 5 Guaranteed Starter Credits'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#10131D] border border-orange-500/40 text-center space-y-0.5">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Remaining</span>
            <div className="text-xl sm:text-2xl font-black text-orange-400">{remaining}</div>
            <span className="text-[8px] sm:text-[9px] text-slate-500 block">Never Expire</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-[#10131D] border border-slate-800 text-center space-y-0.5">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Credits Used</span>
            <div className="text-xl sm:text-2xl font-black text-white">{totalUsed}</div>
            <span className="text-[8px] sm:text-[9px] text-slate-500 block">AI Requests</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-[#10131D] border border-slate-800 text-center space-y-0.5">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Purchased</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{totalPurchased}</div>
            <span className="text-[8px] sm:text-[9px] text-slate-500 block">Credit Packs</span>
          </div>
        </div>

        {/* 1. Guaranteed Starter Credits Status */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-emerald-300">5 Starter Credits</span>
              <span className="text-slate-400 ml-1.5 hidden sm:inline">— Guaranteed on first use</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shrink-0">
            <Check className="w-3 h-3" /> Active
          </span>
        </div>

        {isLoggedIn ? (
          <>
            {/* 2. Optional Social Media Tasks */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-orange-400" /> Earn More Credits (Social Tasks)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Earn up to <strong className="text-amber-400">+5 Bonus Credits</strong> by following official channels.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 shrink-0">
                  {socialBonusEarned} / 5 earned
                </span>
              </div>

              {socialMessage.text && (
                <div className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${socialMessage.isError ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                  {socialMessage.isError ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <Check className="w-3.5 h-3.5 shrink-0" />}
                  <span>{socialMessage.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {socialTasks.map((task) => {
                  const isClaiming = claimingTaskId === task.task_id;
                  return (
                    <div
                      key={task.task_id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                        task.completed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                          : 'bg-[#151926] border-slate-800 hover:border-orange-500/40 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-lg bg-black/40 border border-slate-800 shrink-0">
                          {getPlatformIcon(task.platform)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">{task.platform}</div>
                          <div className="text-[10px] text-slate-400 truncate">{task.action}</div>
                        </div>
                      </div>

                      {task.completed ? (
                        <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3" /> +{task.reward_amount} Cr
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaimSocial(task)}
                          disabled={isClaiming || socialBonusEarned >= 5}
                          className="px-3 py-1.5 min-h-[38px] rounded-lg text-[11px] font-bold bg-orange-500/15 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          {isClaiming ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <span>+{task.reward_amount}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Refer & Earn Section (Redesigned & Responsive) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
              {/* Header with clear title & badge */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-orange-400" /> Refer & Earn (+5 Credits Each)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Share your link with friends. You both earn +5 credits when they join.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                  +5 / Referral
                </span>
              </div>

              {/* Error & Retry Handling */}
              {rewardsError ? (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-400 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">{rewardsError}</span>
                  </div>
                  <button
                    onClick={fetchRewards}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-bold flex items-center gap-1 shrink-0 cursor-pointer min-h-[36px]"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                </div>
              ) : (
                /* Main Referral Code & Actions Box */
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#151926] border border-slate-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Your Permanent Referral Code</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isLoadingRewards ? (
                          <div className="flex items-center gap-2 py-1">
                            <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                            <span className="text-xs text-slate-400 font-mono">Loading code...</span>
                          </div>
                        ) : (
                          <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-orange-400 select-all">
                            {userReferralCode || 'UNAVAILABLE'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Copy Code, Copy Link, Share Referral */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleCopyCode(userReferralCode)}
                        disabled={!userReferralCode || isLoadingRewards}
                        className="flex-1 sm:flex-initial px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        title="Copy Referral Code"
                      >
                        {copyStatus === 'code' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Code Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyLink(userReferralCode)}
                        disabled={!userReferralCode || isLoadingRewards}
                        className="flex-1 sm:flex-initial px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        title="Copy Referral Link"
                      >
                        {copyStatus === 'link' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleShareReferral(userReferralCode)}
                        disabled={!userReferralCode || isLoadingRewards}
                        className="w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-xl text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        title="Share Referral Link"
                      >
                        {copyStatus === 'share' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-black" />
                            <span>Shared!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-black" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Shareable Link Display */}
                  {userReferralCode && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate">
                        Link: <span className="font-mono text-slate-300 select-all">{getReferralShareUrl(userReferralCode).replace('https://', '')}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Referral Stats Summary */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#151926] border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Successful Referrals</span>
                  <span className="font-black text-sm sm:text-base text-white">{successfulReferrals}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#151926] border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Referral Credits Earned</span>
                  <span className="font-black text-sm sm:text-base text-emerald-400">+{referralCreditsEarned} Cr</span>
                </div>
              </div>

              {/* Redeem Friend's Code Form */}
              {hasRedeemedReferral ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Referral code <strong className="font-mono font-bold tracking-wider">{redeemedCode}</strong> redeemed (+5 Credits claimed).
                  </span>
                </div>
              ) : (
                <form onSubmit={handleApplyReferral} className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-300 block">Have a friend's referral code?</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={inputReferralCode}
                      onChange={(e) => setInputReferralCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      placeholder="ENTER 6-LETTER CODE"
                      className="flex-1 px-3 py-2.5 min-h-[44px] bg-[#151926] border border-slate-700 rounded-xl text-xs text-white font-mono tracking-widest uppercase focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={isRedeemingReferral || inputReferralCode.trim().length !== 6}
                      className="px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                    >
                      {isRedeemingReferral ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply Code'}
                    </button>
                  </div>
                  {referralMessage.text && (
                    <p className={`text-[11px] font-semibold ${referralMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      {referralMessage.text}
                    </p>
                  )}
                </form>
              )}
            </div>
          </>
        ) : null}

        {/* Usage History Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-500" /> Recent Activity History
            </h4>
            <span className="text-[10px] text-slate-500">{usageHistory.length} logs</span>
          </div>

          {usageHistory.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-500 bg-[#10131D] rounded-xl border border-slate-800">
              No usage activity logged yet.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
              {usageHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl bg-[#10131D] border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-slate-200 truncate">{item.action}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.creditsUsed > 0 && (
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                        -{item.creditsUsed} Cr
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleClose();
                setIsBuyCreditsModalOpen(true);
              }}
              className="w-full py-3 min-h-[44px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Need More? Buy Credit Pack (From ₹29)
            </button>
          ) : (
            <button
              onClick={() => {
                handleClose();
                setIsUnlockAIModalOpen(true);
              }}
              className="w-full py-3 min-h-[44px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Login & Claim 5 Guaranteed Credits
            </button>
          )}

          <button
            onClick={handleClose}
            className="w-full py-2 min-h-[44px] text-center text-xs font-semibold text-slate-400 hover:text-white cursor-pointer flex items-center justify-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

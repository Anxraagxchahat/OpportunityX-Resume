import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, Sparkles, CheckCircle2, CreditCard, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { apiService } from '../services/api';
import { pingBackendWarmup, preloadCashfreeSDK } from '../utils/paymentPreloader';

const CREDIT_PACKS = [
  { id: 'pack-starter', price: 1, credits: 15, perCredit: '₹0.07/cr', tag: 'Starter Pack', icon: '⚡' },
  { id: 'pack-popular', price: 49, credits: 25, perCredit: '₹1.96/cr', tag: 'Most Popular', popular: true, icon: '🚀' },
  { id: 'pack-best', price: 99, credits: 50, perCredit: '₹1.98/cr', tag: 'Best Value', icon: '💎' },
  { id: 'pack-pro', price: 199, credits: 100, perCredit: '₹1.99/cr', tag: 'Pro Pack', icon: '⭐' }
];

const COUNTRIES = [
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', minDigits: 10, maxDigits: 10 },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', minDigits: 10, maxDigits: 10 },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', minDigits: 10, maxDigits: 10 },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', minDigits: 10, maxDigits: 10 },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', minDigits: 9, maxDigits: 9 },
  { code: 'AE', name: 'UAE', dial: '+971', flag: '🇦🇪', minDigits: 9, maxDigits: 9 },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬', minDigits: 8, maxDigits: 8 },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦', minDigits: 9, maxDigits: 9 },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪', minDigits: 10, maxDigits: 11 },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 9 },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵', minDigits: 10, maxDigits: 10 },
  { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵', minDigits: 10, maxDigits: 10 },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩', minDigits: 10, maxDigits: 10 },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰', minDigits: 10, maxDigits: 10 },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰', minDigits: 9, maxDigits: 9 },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾', minDigits: 9, maxDigits: 10 },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿', minDigits: 8, maxDigits: 9 },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹', minDigits: 10, maxDigits: 10 },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸', minDigits: 9, maxDigits: 9 },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷', minDigits: 11, maxDigits: 11 },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽', minDigits: 10, maxDigits: 10 },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦', minDigits: 9, maxDigits: 9 },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬', minDigits: 10, maxDigits: 10 },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩', minDigits: 10, maxDigits: 11 },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭', minDigits: 10, maxDigits: 10 },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳', minDigits: 9, maxDigits: 9 },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭', minDigits: 9, maxDigits: 9 },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦', minDigits: 8, maxDigits: 8 },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼', minDigits: 8, maxDigits: 8 },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲', minDigits: 8, maxDigits: 8 },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭', minDigits: 8, maxDigits: 8 },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬', minDigits: 10, maxDigits: 10 }
];

const loadCashfreeScript = (env = 'sandbox') => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error('Failed to load Cashfree Payment SDK'));
    document.body.appendChild(script);
  });
};

export const BuyCreditsModal = ({ isOpen, onClose }) => {
  const {
    isBuyCreditsModalOpen,
    setIsBuyCreditsModalOpen,
    session,
    setIsUnlockAIModalOpen,
    addPurchasedCredits,
    aiCredits
  } = useResume();

  const [selectedPack, setSelectedPack] = useState(CREDIT_PACKS[1]);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [paymentStep, setPaymentStep] = useState('select'); // 'select' | 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(session?.phone || session?.phoneNumber || '');
  const [errorMsg, setErrorMsg] = useState('');

  const active = isOpen !== undefined ? isOpen : isBuyCreditsModalOpen;

  useEffect(() => {
    if (active) {
      pingBackendWarmup();
      preloadCashfreeSDK();
    }
  }, [active]);

  const validatePhone = (phoneStr, country = selectedCountry) => {
    const clean = (phoneStr || '').replace(/\D/g, '');
    if (!country) return false;
    if (clean.length < country.minDigits || clean.length > country.maxDigits) return false;
    if (country.code === 'IN' && !/^[6-9]\d{9}$/.test(clean)) return false;
    if (/^(.)\1+$/.test(clean) && clean.length >= 6) return false;
    if (clean === '1234567890' || clean === '9876543210') return false;
    return true;
  };

  const handleClose = () => {
    setPaymentStep('select');
    setIsProcessing(false);
    setErrorMsg('');
    if (onClose) onClose();
    else setIsBuyCreditsModalOpen(false);
  };

  if (!active) return null;

  // Guest Mode Guard
  if (!session || !session.isAuthenticated || session.isGuest) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="bg-[#0B0D14] border border-orange-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 text-center">
          <Sparkles className="w-10 h-10 text-orange-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-black text-white">Login Required to Buy Credits</h3>
          <p className="text-xs text-slate-300">
            Purchased credits are safely linked to your OpportunityX account so they never expire across any device.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                handleClose();
                setIsUnlockAIModalOpen(true);
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg"
            >
              Login & Get 5 Welcome Credits First
            </button>
            <button
              onClick={handleClose}
              className="w-full py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInitiateCashfreePayment = async () => {
    if (isProcessing) return; // Prevent duplicate payment session requests

    if (!customerPhone || !validatePhone(customerPhone, selectedCountry)) {
      const requiredDigitsText = selectedCountry.minDigits === selectedCountry.maxDigits 
        ? `${selectedCountry.minDigits} digits` 
        : `${selectedCountry.minDigits}-${selectedCountry.maxDigits} digits`;
      setErrorMsg(`Please enter a valid ${requiredDigitsText} mobile number for ${selectedCountry.flag} ${selectedCountry.name}.`);
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg("You must accept the Terms & Conditions and Refund Policy to proceed.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    try {
      // Pass full phone string to backend
      const fullPhone = customerPhone.replace(/\D/g, '');
      const orderData = await apiService.createCashfreeOrder(selectedPack.id, fullPhone);

      if (!orderData || !orderData.payment_session_id) {
        throw new Error("Invalid payment session received from backend.");
      }

      // 2. Live Cashfree Web SDK Payment Modal Checkout
      await loadCashfreeScript(orderData.environment);
      const cashfree = window.Cashfree({ mode: orderData.environment === 'production' ? 'production' : 'sandbox' });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: '_modal'
      }).then(async () => {
        const verifyRes = await apiService.verifyCashfreeOrder(orderData.order_id);
        if (verifyRes.ok && verifyRes.status === 'PAID') {
          // Fetch authoritative credit balance from backend DB
          try {
            const walletData = await apiService.getCreditBalance();
            if (walletData && typeof walletData.remaining_credits === 'number') {
              addPurchasedCredits(selectedPack.credits, `₹${selectedPack.price} Pack (Cashfree)`);
            }
          } catch (e) {
            addPurchasedCredits(selectedPack.credits, `₹${selectedPack.price} Pack (Cashfree)`);
          }
          setPaymentStep('success');
        } else {
          setErrorMsg(verifyRes.message || "Payment verification returned pending/failed status. No credits were added.");
        }
        setIsProcessing(false);
      }).catch((err) => {
        setIsProcessing(false);
        setErrorMsg("Payment was cancelled or closed. No charges were made to your account.");
      });

    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err.message || "We couldn't start the payment securely. Please try again.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-orange-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-30"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentStep === 'select' && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3">
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
              <div>
                <h3 className="text-xl font-black text-white">Buy OpportunityX AI Credits</h3>
                <p className="text-xs text-slate-400">
                  Current Balance: <strong className="text-orange-400 font-bold">{aiCredits.remaining} Credits</strong>
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{errorMsg}</p>
                  <button
                    onClick={handleInitiateCashfreePayment}
                    disabled={isProcessing}
                    className="text-[11px] font-bold text-orange-400 underline hover:text-orange-300 disabled:opacity-50"
                  >
                    Click to Retry Payment
                  </button>
                </div>
              </div>
            )}

            {/* Pack Grid */}
            <div className="grid grid-cols-2 gap-3">
              {CREDIT_PACKS.map((pack) => {
                const isSelected = selectedPack.id === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => !isProcessing && setSelectedPack(pack)}
                    className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between space-y-3 ${
                      isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                        : 'bg-[#10131D] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500 text-black shadow-md">
                        {pack.tag}
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                          {!pack.popular && pack.tag}
                        </span>
                        <span className="text-base">{pack.icon}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">₹{pack.price}</span>
                        <span className="text-[10px] text-slate-400">{pack.perCredit}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-black text-orange-400">{pack.credits} Credits</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-orange-500 bg-orange-500 text-black' : 'border-slate-700'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mandatory Mobile Number Input with Country Flag Dropdown */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300">
                Mobile Number <span className="text-orange-400">*</span>{' '}
                <span className="text-[10px] text-slate-400 font-normal">
                  ({selectedCountry.flag} {selectedCountry.dial} — {selectedCountry.minDigits === selectedCountry.maxDigits ? `${selectedCountry.minDigits} digits` : `${selectedCountry.minDigits}-${selectedCountry.maxDigits} digits`})
                </span>
              </label>
              <div className="flex items-center gap-2">
                {/* Country Flag & Code Selector */}
                <select
                  value={selectedCountry.code}
                  disabled={isProcessing}
                  onChange={(e) => {
                    const found = COUNTRIES.find((c) => c.code === e.target.value);
                    if (found) {
                      setSelectedCountry(found);
                      setCustomerPhone('');
                      if (errorMsg) setErrorMsg('');
                    }
                  }}
                  className="bg-[#0B0D14] border border-slate-700 text-xs font-bold text-slate-200 rounded-lg px-2.5 py-2 outline-none cursor-pointer hover:border-orange-500 transition-colors shrink-0 disabled:opacity-50"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0B0D14] text-white">
                      {c.flag} {c.dial} ({c.name})
                    </option>
                  ))}
                </select>

                {/* Subscriber Number Input */}
                <input
                  type="tel"
                  maxLength={selectedCountry.maxDigits}
                  value={customerPhone}
                  disabled={isProcessing}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setCustomerPhone(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={`Enter ${selectedCountry.minDigits === selectedCountry.maxDigits ? selectedCountry.minDigits : `${selectedCountry.minDigits}-${selectedCountry.maxDigits}`}-digit mobile number`}
                  className="w-full px-3 py-2 bg-[#0B0D14] border border-slate-700 focus:border-orange-500 rounded-lg text-xs text-white placeholder-slate-500 outline-none transition-colors disabled:opacity-50 font-mono tracking-wider"
                />
              </div>
            </div>

            {/* Mandatory Terms & Policy Checkbox */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <label className="flex items-start gap-2.5 text-[11px] text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  disabled={isProcessing}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setErrorMsg('');
                  }}
                  className="w-4 h-4 mt-0.5 accent-orange-500 shrink-0 cursor-pointer disabled:opacity-50"
                />
                <span>
                  I accept the{' '}
                  <Link to="/legal/terms-and-conditions" target="_blank" className="text-orange-400 underline hover:text-orange-300">
                    Terms & Conditions
                  </Link>,{' '}
                  <Link to="/legal/refund-policy" target="_blank" className="text-orange-400 underline hover:text-orange-300">
                    Refund & Cancellation Policy
                  </Link>, and{' '}
                  <Link to="/legal/privacy-policy" target="_blank" className="text-orange-400 underline hover:text-orange-300">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
            </div>

            {/* Cashfree Payment Gateway Badge & Compliance Footer */}
            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-400">
                <Lock className="w-3.5 h-3.5" /> Secure Payments via Cashfree Payment Gateway
              </div>
              <p className="text-[10px] text-slate-400">
                Supports UPI (GPay, PhonePe, Paytm, BHIM), NetBanking, & Cards. Credits delivered instantly upon verification.
              </p>
            </div>

            {/* Processing Banner */}
            {isProcessing && (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-slate-300 text-xs space-y-1 animate-pulse text-center">
                <p className="font-bold text-orange-400">Preparing secure payment…</p>
                <p className="text-[11px] text-slate-400">
                  This may take up to 10–15 seconds on the first request while we securely connect to the payment service.
                </p>
              </div>
            )}

            {/* CTA Purchase Button */}
            {(() => {
              const isFormValid = acceptedTerms && validatePhone(customerPhone, selectedCountry);
              return (
                <button
                  onClick={handleInitiateCashfreePayment}
                  disabled={isProcessing || !isFormValid}
                  className={`w-full py-3.5 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isFormValid && !isProcessing
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-orange-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-75'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-orange-400" />
                      <span className="text-orange-400">Preparing secure payment…</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{selectedPack.price} via Cashfree</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              );
            })()}
          </>
        )}

        {paymentStep === 'success' && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-300 mt-1">
                <strong className="text-emerald-400 font-bold">+{selectedPack.credits} AI Credits</strong> added to your account via Cashfree PG.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                New Balance: <strong className="text-white">{aiCredits.remaining} Credits</strong>
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs rounded-xl shadow-lg"
            >
              Continue Working Exactly Where You Left Off
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

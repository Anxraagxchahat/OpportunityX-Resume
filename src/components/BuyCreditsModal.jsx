import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, Sparkles, CheckCircle2, CreditCard, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { apiService } from '../services/api';

const CREDIT_PACKS = [
  { id: 'pack-starter', price: 1, credits: 15, perCredit: '₹0.07/cr', tag: 'Starter Pack', icon: '⚡' },
  { id: 'pack-popular', price: 49, credits: 25, perCredit: '₹1.96/cr', tag: 'Most Popular', popular: true, icon: '🚀' },
  { id: 'pack-best', price: 99, credits: 50, perCredit: '₹1.98/cr', tag: 'Best Value', icon: '💎' },
  { id: 'pack-pro', price: 199, credits: 100, perCredit: '₹1.99/cr', tag: 'Pro Pack', icon: '⭐' }
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
  const [paymentStep, setPaymentStep] = useState('select'); // 'select' | 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const active = isOpen !== undefined ? isOpen : isBuyCreditsModalOpen;
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
    if (!acceptedTerms) {
      setErrorMsg("You must accept the Terms & Conditions and Refund Policy to proceed.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    try {
      // 1. Create Cashfree Order on Production Backend
      const orderData = await apiService.createCashfreeOrder(selectedPack.id);

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
        setErrorMsg(err.message || "Cashfree payment modal dismissed or failed.");
      });

    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err.message || "Could not connect to Cashfree payment server.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-orange-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentStep === 'select' && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Buy OpportunityX AI Credits</h3>
                <p className="text-xs text-slate-400">
                  Current Balance: <strong className="text-orange-400 font-bold">{aiCredits.remaining} Credits</strong>
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Pack Grid */}
            <div className="grid grid-cols-2 gap-3">
              {CREDIT_PACKS.map((pack) => {
                const isSelected = selectedPack.id === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
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

            {/* Mandatory Terms & Policy Checkbox */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <label className="flex items-start gap-2.5 text-[11px] text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setErrorMsg('');
                  }}
                  className="w-4 h-4 mt-0.5 accent-orange-500 shrink-0 cursor-pointer"
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

            {/* CTA Purchase Button */}
            <button
              onClick={handleInitiateCashfreePayment}
              disabled={isProcessing || !acceptedTerms}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Cashfree Payment Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{selectedPack.price} via Cashfree</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
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

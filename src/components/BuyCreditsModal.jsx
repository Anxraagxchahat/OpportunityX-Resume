import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, CheckCircle2, CreditCard, QrCode, ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const CREDIT_PACKS = [
  { id: 'pack-starter', price: 29, credits: 15, perCredit: '₹1.93/cr', tag: 'Starter Pack' },
  { id: 'pack-popular', price: 49, credits: 30, perCredit: '₹1.63/cr', tag: 'Most Popular', popular: true },
  { id: 'pack-best', price: 99, credits: 70, perCredit: '₹1.41/cr', tag: 'Best Value' },
  { id: 'pack-pro', price: 199, credits: 160, perCredit: '₹1.24/cr', tag: 'Pro Pack' }
];

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
  const [paymentStep, setPaymentStep] = useState('select'); // 'select' | 'upi' | 'success'
  const [upiMethod, setUpiMethod] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'custom'
  const [customUpiId, setCustomUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const active = isOpen !== undefined ? isOpen : isBuyCreditsModalOpen;
  const handleClose = () => {
    setPaymentStep('select');
    setIsProcessing(false);
    if (onClose) onClose();
    else setIsBuyCreditsModalOpen(false);
  };

  if (!active) return null;

  // Check if guest - prompt login first
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

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      addPurchasedCredits(selectedPack.credits, `₹${selectedPack.price} Pack`);
      setPaymentStep('success');
    }, 1200);
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
                <h3 className="text-xl font-black text-white">Need More AI Credits?</h3>
                <p className="text-xs text-slate-400">
                  Current Balance: <strong className="text-orange-400 font-bold">{aiCredits.remaining} Credits</strong>
                </p>
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Zero Subscription Commitment
              </div>
              <p className="text-[11px] text-slate-400">
                No monthly recurring charges. Only buy credit packs when you need them. Credits <strong>never expire</strong>.
              </p>
            </div>

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
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        {!pack.popular && pack.tag}
                      </span>
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

            {/* CTA Button */}
            <button
              onClick={() => setPaymentStep('upi')}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Pay ₹{selectedPack.price} via UPI for {selectedPack.credits} Credits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {paymentStep === 'upi' && (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaymentStep('select')}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <div>
                <h3 className="text-base font-extrabold text-white">Instant UPI Payment</h3>
                <p className="text-xs text-slate-400">Selected: {selectedPack.credits} Credits (₹{selectedPack.price})</p>
              </div>
            </div>

            {/* Payment App Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Choose UPI App / Method</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gpay', name: 'Google Pay', icon: '⚡' },
                  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                  { id: 'paytm', name: 'Paytm', icon: '🔵' },
                  { id: 'bhim', name: 'BHIM UPI', icon: '🟠' }
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setUpiMethod(app.id)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      upiMethod === app.id
                        ? 'bg-orange-500/20 text-white border-orange-500'
                        : 'bg-[#10131D] text-slate-300 border-slate-800'
                    }`}
                  >
                    <span>{app.icon}</span> {app.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom UPI ID */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-400">Or enter UPI ID</label>
              <input
                type="text"
                value={customUpiId}
                onChange={(e) => setCustomUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Simulated UPI QR / Auto Pay Notice */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
              <div className="inline-flex p-2 bg-white rounded-lg">
                <QrCode className="w-16 h-16 text-black" />
              </div>
              <p className="text-[11px] text-slate-400">
                UPI Merchant: <strong className="text-white">opportunityx@upi</strong>
              </p>
            </div>

            {/* Action */}
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying UPI Payment...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Confirm UPI Payment of ₹{selectedPack.price}
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
                <strong className="text-emerald-400 font-bold">+{selectedPack.credits} AI Credits</strong> added to your account.
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

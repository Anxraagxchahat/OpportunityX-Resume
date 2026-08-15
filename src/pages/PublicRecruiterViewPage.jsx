import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ShieldCheck, Mail, Phone, MapPin, Globe, CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { A4ResumePreview } from '../components/A4ResumePreview';
import { generateVerificationDetails } from '../services/ecosystem/verificationEngine';
import { getOrCreateUniversalIdentity } from '../services/ecosystem/identityManager';
import { downloadDirectPDF } from '../utils/pdfDownloader';

export const PublicRecruiterViewPage = () => {
  const { slug } = useParams();
  const { activeResume, setIsDownloadSuccessModalOpen } = useResume();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const identity = getOrCreateUniversalIdentity();
  const verification = generateVerificationDetails(activeResume, identity.oxId);

  const handleDownloadPDF = async () => {
    const candidateName = activeResume?.personal?.fullName || 'Candidate';
    await downloadDirectPDF('resume-a4-preview', candidateName);
    setTimeout(() => {
      setIsDownloadSuccessModalOpen(true);
    }, 400);
  };

  const handleSendContact = (e) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsContactOpen(false);
      setContactMsg('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-slate-100 flex flex-col">
      {/* Top Recruiter Header Bar */}
      <header className="bg-[#0B0D14] border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 no-print">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white">{activeResume.personal?.fullName || "Candidate Resume"}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Candidate
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Public Recruiter Link: resume.opportunityx.co.in/u/{slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContactOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Mail className="w-3.5 h-3.5" /> Contact Candidate
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" /> Download PDF
          </button>
        </div>
      </header>

      {/* Main Recruiter Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 overflow-y-auto">
        {/* Verification Banner */}
        <div className="w-full max-w-4xl p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold">Verified OpportunityX Profile ({verification.verificationId})</span>
              <span className="hidden sm:inline text-[11px] text-slate-400 ml-2">Authenticated via verify.opportunityx.co.in</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            {identity.oxId}
          </span>
        </div>

        {/* Live Resume Preview Component */}
        <div className="w-full max-w-4xl flex justify-center">
          <A4ResumePreview />
        </div>
      </main>

      {/* Contact Candidate Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 relative">
            <button onClick={() => setIsContactOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400" /> Contact Candidate
            </h3>

            {sentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-bold">
                Message delivered to candidate!
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-3">
                <textarea
                  rows={4}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Write a message or interview invitation to the candidate..."
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                />
                <button type="submit" className="w-full py-2.5 bg-orange-500 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Send Recruiter Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

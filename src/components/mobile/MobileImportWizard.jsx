import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, ArrowLeft, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { apiService } from '../../services/api';

export const MobileImportWizard = () => {
  const navigate = useNavigate();
  const { importResumeData } = useResume();

  const [step, setStep] = useState(1); // 1: Upload, 2: Extracting, 3: Review, 4: Complete, 5: Error
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartExtraction = async () => {
    if (!file) return;

    setStep(2); // Extracting stage
    setErrorMessage('');

    try {
      // Call backend API to parse PDF/DOCX resume
      const response = await apiService.parseResume(file);

      if (response && response.success && response.data) {
        setExtractedData(response.data);
        setStep(3); // Review stage
      } else {
        // Strict: Never silently load demo data on failure!
        setErrorMessage(response?.error || 'Failed to extract resume structure. File may be corrupted or unreadable.');
        setStep(5); // Error state
      }
    } catch (err) {
      console.error('Import Extraction Failed:', err);
      setErrorMessage(err.message || 'Extraction service currently unavailable. Please try another file.');
      setStep(5); // Error state
    }
  };

  const handleConfirmImport = () => {
    if (extractedData) {
      importResumeData(extractedData);
      sessionStorage.setItem('ox_import_success_toast', 'Resume imported successfully.');
      navigate('/builder');
    }
  };

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] p-4 space-y-6 pb-28 select-none no-print">
      
      {/* Header Navigation */}
      <div className="flex items-center justify-between border-b border-[var(--ox-border)] pb-3">
        <button
          onClick={() => navigate('/builder')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] font-bold text-xs min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Builder</span>
        </button>
        <span className="text-sm font-black text-[var(--ox-text-primary)]">Import Resume</span>
        <div className="w-10" />
      </div>

      {/* 5-Step Visual Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-[var(--ox-text-secondary)]">
          <span className={step >= 1 ? 'text-orange-400' : ''}>1. Upload</span>
          <span className={step >= 2 ? 'text-orange-400' : ''}>2. Extract</span>
          <span className={step >= 3 ? 'text-orange-400' : ''}>3. Review</span>
          <span className={step >= 4 ? 'text-orange-400' : ''}>4. Complete</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--ox-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Upload Screen */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-5 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-[var(--ox-text-primary)]">Upload PDF or DOCX</h3>
            <p className="text-xs text-[var(--ox-text-secondary)]">
              OpportunityX AI will extract your experience, education, projects, and skills.
            </p>
          </div>

          <label className="block p-6 border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-2xl cursor-pointer bg-[var(--ox-surface-secondary)]/50 transition-colors">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <span className="text-xs font-bold text-[var(--ox-text-primary)] block">
                {file ? file.name : 'Tap to select document'}
              </span>
              <span className="text-[10px] text-[var(--ox-text-muted)] block">PDF, DOCX up to 10MB</span>
            </div>
          </label>

          {file && (
            <button
              onClick={handleStartExtraction}
              className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Extract Resume</span>
            </button>
          )}
        </div>
      )}

      {/* STEP 2: Extracting Loading Screen */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-center space-y-4 py-12">
          <RefreshCw className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-[var(--ox-text-primary)]">Analyzing your resume...</h3>
            <p className="text-xs text-[var(--ox-text-secondary)]">Parsing sections, experience bullets & skill tags</p>
          </div>
        </div>
      )}

      {/* STEP 3: Review Extracted Details */}
      {step === 3 && extractedData && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Resume Extraction Complete</span>
            </div>
            
            <div className="p-3 rounded-2xl bg-[var(--ox-surface-secondary)] space-y-2 text-xs">
              <div>
                <span className="text-[var(--ox-text-muted)] block text-[10px]">Name</span>
                <span className="font-bold text-[var(--ox-text-primary)]">{extractedData.personal?.fullName || 'Extracted Name'}</span>
              </div>
              <div>
                <span className="text-[var(--ox-text-muted)] block text-[10px]">Target Role</span>
                <span className="font-bold text-[var(--ox-text-primary)]">{extractedData.personal?.targetRole || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[var(--ox-text-muted)] block text-[10px]">Extracted Sections</span>
                <span className="font-bold text-orange-400">
                  {Array.isArray(extractedData.experience) ? extractedData.experience.length : 0} Experience, {Array.isArray(extractedData.education) ? extractedData.education.length : 0} Education
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirmImport}
            className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 min-h-[48px] active:scale-95 transition-transform"
          >
            <span>Confirm & Open Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 5: Robust Error Recovery State */}
      {step === 5 && (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-rose-400">Couldn't extract your resume</h3>
            <p className="text-xs text-[var(--ox-text-secondary)]">{errorMessage}</p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-2xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] font-bold text-xs min-h-[44px]"
            >
              Try Again / Upload Different File
            </button>
            <button
              onClick={() => navigate('/builder')}
              className="w-full py-3 rounded-2xl bg-orange-500 text-white font-bold text-xs min-h-[44px]"
            >
              Enter Manually in Builder
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MobileImportWizard;

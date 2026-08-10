import React from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export class MobileErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Mobile Builder Component Failure:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-dvh bg-[var(--ox-bg)] flex flex-col items-center justify-center p-6 text-center space-y-5 select-none no-print">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-[var(--ox-text-primary)]">Something went wrong</h2>
            <p className="text-xs text-[var(--ox-text-secondary)] max-w-xs mx-auto leading-relaxed">
              An unexpected error occurred while rendering the mobile resume editor. Your resume data is saved safely in local storage.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <a
              href="/dashboard"
              className="w-full py-3.5 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] font-bold text-sm flex items-center justify-center gap-2 min-h-[48px]"
            >
              <LayoutDashboard className="w-4 h-4 text-orange-400" />
              <span>Return to Dashboard</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MobileErrorBoundary;

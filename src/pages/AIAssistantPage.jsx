import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  ArrowRight,
  Bot,
  FileText,
  Cpu,
  Layers
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const AIAssistantPage = () => {
  const navigate = useNavigate();
  const { resumeData, updatePersonal } = useResume();
  const [promptInput, setPromptInput] = useState('Senior Full Stack Engineer with expertise in React, Node.js, and cloud architecture...');
  const [outputResult, setOutputResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const aiTools = [
    { title: 'Summary Generator', desc: 'Creates high-impact executive summaries for software engineering and tech roles.', icon: FileText, sample: 'Generate professional summary for Full Stack Engineer' },
    { title: 'Experience Bullet Enhancer', desc: 'Rewrites weak experience points using metric-driven XYZ frameworks (Accomplished X by Y resulting in Z).', icon: Wand2, sample: 'Engineered high-concurrency microservices processing 10M+ daily events' },
    { title: 'Tech Stack Keyword Injector', desc: 'Suggests high-relevance technical skills and frameworks to pass ATS filters.', icon: Cpu, sample: 'Suggest relevant technologies for Backend Engineer' },
    { title: 'Grammar & Tone Optimizer', desc: 'Fixes passive voice and polishes tone for executive readability.', icon: Bot, sample: 'Fix grammar and polish tone for engineering manager resume' }
  ];

  const handleTestGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setOutputResult(
        `Architected distributed microservices and front-end user interfaces processing 15M+ daily API requests with 99.99% uptime. Optimized database query performance to reduce P99 response latency by 45% across 2M+ active users.`
      );
    }, 700);
  };

  const handleApplyToResume = () => {
    if (outputResult) {
      updatePersonal('summary', outputResult);
      navigate('/builder');
    }
  };

  const handleCopy = () => {
    if (outputResult) {
      navigator.clipboard.writeText(outputResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
          <Wand2 className="w-3.5 h-3.5 animate-pulse" /> AI Assistant Playground
        </div>
        <h1 className="text-3xl font-black text-white">AI Writing Assistant & Optimization</h1>
        <p className="text-sm text-slate-400">
          Experimental AI playground for generating summaries, polishing experience bullet points, and adding ATS keywords.
        </p>
      </div>

      {/* Grid of AI Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiTools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                setPromptInput(tool.sample);
                handleTestGenerate();
              }}
              className="cyber-glass-card p-5 space-y-3 hover:border-orange-500/50 transition-all cursor-pointer group"
            >
              <div className="p-2.5 w-max rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{tool.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive AI Test Bench Area */}
      <div className="cyber-glass-card p-6 space-y-6 max-w-4xl mx-auto border-orange-500/30">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">AI Generation Playground</h3>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
            Phase 0 Engine
          </span>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Input Prompt / Existing Text</label>
          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleTestGenerate}
          disabled={isGenerating}
          className="px-5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-[0_0_18px_rgba(249,115,22,0.3)] transition-all flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" /> Run AI Enhancement
            </>
          )}
        </button>

        {/* Output Result */}
        {outputResult && (
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-orange-400">
              <span>AI Optimized Output</span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-normal"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{outputResult}</p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleApplyToResume}
                className="px-4 py-2 text-xs font-bold text-black bg-orange-500 hover:bg-orange-400 rounded-lg flex items-center gap-1.5"
              >
                Apply to Active Resume Summary <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

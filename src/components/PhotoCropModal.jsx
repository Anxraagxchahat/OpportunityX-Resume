import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sliders,
  ZoomIn,
  ZoomOut,
  Check,
  RotateCcw,
  MoveVertical,
  Maximize2,
  Crop,
  Sparkles,
  Camera
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const PhotoCropModal = ({ isOpen, onClose, photoSrc }) => {
  const { activeResume, updateAssets } = useResume();
  const { assets = {} } = activeResume || {};

  const [offsetY, setOffsetY] = useState(assets?.photoOffsetY ?? 50);
  const [zoom, setZoom] = useState(assets?.photoZoom ?? 100);
  const [shape, setShape] = useState(assets?.photoShape ?? 'circle');
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startOffsetYRef = useRef(50);

  useEffect(() => {
    if (isOpen) {
      setOffsetY(assets?.photoOffsetY ?? 50);
      setZoom(assets?.photoZoom ?? 100);
      setShape(assets?.photoShape ?? 'circle');
    }
  }, [isOpen, assets]);

  if (!isOpen || !photoSrc) return null;

  const handleApply = () => {
    updateAssets('photoOffsetY', offsetY);
    updateAssets('photoZoom', zoom);
    updateAssets('photoShape', shape);
    onClose();
  };

  const handleReset = () => {
    setOffsetY(50);
    setZoom(100);
  };

  // Drag handler for dragging up & down directly on the image preview
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startOffsetYRef.current = offsetY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startYRef.current;
    const scale = (zoom || 100) / 100;
    // Map mouse drag delta Y to 0-100 percentage range with zoom sensitivity adjustment
    const sensitivity = 0.45 / scale;
    const newOffset = Math.max(0, Math.min(100, startOffsetYRef.current - (deltaY * sensitivity)));
    setOffsetY(Math.round(newOffset));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Compute preview shift Y in pixels
  const frameSize = 144;
  const scale = (zoom || 100) / 100;
  const maxShiftPx = (frameSize * 0.45) * scale;
  const previewShiftY = ((50 - offsetY) / 50) * maxShiftPx;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md no-print overflow-y-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 text-[var(--ox-text-primary)] relative my-auto transition-colors duration-300"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 pr-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/30">
              <Crop className="w-3.5 h-3.5" /> Interactive Photo Crop & Alignment
            </div>
            <h2 className="text-xl font-extrabold text-[var(--ox-text-primary)]">Adjust Profile Photo Position</h2>
            <p className="text-xs text-[var(--ox-text-secondary)] font-medium">
              Drag image up & down or use sliders to adjust vertical position and zoom scale.
            </p>
          </div>

          {/* Preview Box & Crop Frame */}
          <div className="flex flex-col items-center justify-center space-y-2 py-4 bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl relative select-none shadow-inner">
            <div className="text-[10px] text-[var(--ox-text-secondary)] font-bold uppercase tracking-wider flex items-center gap-1">
              <MoveVertical className="w-3.5 h-3.5 text-orange-500" /> Click & Drag Up / Down to Position
            </div>

            {/* Interactive Photo Frame */}
            <div
              onMouseDown={handleMouseDown}
              className={`w-36 h-36 border-2 border-orange-500 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing relative flex items-center justify-center bg-[var(--ox-surface-secondary)] ${
                shape === 'square' ? 'rounded-lg' : shape === 'rounded' ? 'rounded-2xl' : 'rounded-full'
              }`}
            >
              <img
                src={photoSrc}
                alt="Crop Preview"
                className="w-full h-full object-cover pointer-events-none transition-transform duration-100 ease-out"
                style={{
                  transform: `translateY(${previewShiftY}px) scale(${scale})`,
                  transformOrigin: 'center center'
                }}
              />

              {/* Grid Lines Overlay */}
              <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
              </div>
            </div>

            <div className="text-[10px] text-[var(--ox-text-secondary)] font-bold pt-1">
              Vertical Position: <span className="text-orange-500">{offsetY}%</span> • Zoom: <span className="text-orange-500">{zoom}%</span>
            </div>
          </div>

          {/* Quick Focus Alignment Buttons */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-primary)] flex items-center justify-between">
              <span>Quick Vertical Focus</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] text-orange-500 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Defaults
              </button>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Top (Face)', val: 10 },
                { label: 'Center (Balanced)', val: 50 },
                { label: 'Bottom (Body)', val: 90 }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setOffsetY(item.val)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    offsetY === item.val
                      ? 'bg-orange-500/20 text-orange-500 border-orange-500/50 shadow-sm'
                      : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Up / Down Vertical Shift Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)]">
              <span className="flex items-center gap-1">
                <MoveVertical className="w-3.5 h-3.5 text-orange-500" /> Shift Up / Down (Offset Y)
              </span>
              <span className="text-orange-500">{offsetY}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-[var(--ox-surface-secondary)] rounded-lg"
            />
          </div>

          {/* Zoom & Scale Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)]">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-amber-500" /> Zoom Scale
              </span>
              <span className="text-orange-500">{zoom}%</span>
            </div>
            <input
              type="range"
              min={100}
              max={220}
              step={5}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-[var(--ox-surface-secondary)] rounded-lg"
            />
          </div>

          {/* Shape Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-primary)]">Crop Display Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'circle', label: 'Circle' },
                { id: 'rounded', label: 'Rounded' },
                { id: 'square', label: 'Square' }
              ].map((shp) => (
                <button
                  key={shp.id}
                  type="button"
                  onClick={() => setShape(shp.id)}
                  className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    shape === shp.id
                      ? 'bg-orange-500/20 text-orange-500 border-orange-500/50'
                      : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                  }`}
                >
                  {shp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save / Apply CTA Row */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--ox-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border border-[var(--ox-border)] font-bold text-xs hover:text-[var(--ox-text-primary)] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" /> Apply Crop & Position
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

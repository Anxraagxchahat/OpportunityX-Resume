import React from 'react';
import { Home, Edit3, Eye, Grid, MoreHorizontal } from 'lucide-react';
import { useMobileNavigation } from '../../context/MobileNavigationContext';

export const MobileBottomNav = () => {
  const { activeTab, setActiveTab, setIsMoreMenuOpen } = useMobileNavigation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'edit', label: 'Edit', icon: Edit3 },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'templates', label: 'Templates', icon: Grid },
    { id: 'more', label: 'More', icon: MoreHorizontal }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] pb-safe select-none no-print shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'more') {
                  setIsMoreMenuOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 transition-colors relative cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-orange-500 font-bold'
                  : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-orange-500' : ''}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>

              {/* Active Tab Highlight Indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-orange-500 shadow-[0_0_8px_#F97316]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

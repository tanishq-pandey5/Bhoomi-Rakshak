import React from 'react';
import { ShieldAlert, User, Bell } from 'lucide-react';

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
  lastUpdated: string;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo, lastUpdated, activeTab = 'dashboard' }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#061521]/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Left: Brand logo & name */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onScrollTo('dashboard')}>
          <div className="flex items-center justify-center w-7 h-7 rounded bg-tealAccent/10 border border-tealAccent/20 text-tealAccent">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-extrabold tracking-wider text-textWhite uppercase">
                Bhoomi Rakshak
              </span>
              <span className="text-[8px] opacity-60 font-semibold uppercase tracking-widest font-mono text-tealAccent">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: Centered Minimalist Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Dashboard', id: 'dashboard' },
            { label: 'Risk Map', id: 'risk-map' },
            { label: 'Alerts', id: 'alerts' },
            { label: 'Methodology', id: 'methodology' },
            { label: 'About Us', id: 'footer' }
          ].map(item => {
            const isAct = activeTab === item.id || (item.id === 'footer' && activeTab === 'footer');
            return (
              <button
                key={item.id}
                onClick={() => onScrollTo(item.id)}
                className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-200 relative pb-1 ${
                  isAct ? 'text-tealAccent' : 'text-textMuted hover:text-textWhite'
                }`}
              >
                {item.label}
                {isAct && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-tealAccent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Status notification & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-textMuted uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>SYSTEM ONLINE</span>
            <span className="opacity-30">|</span>
            <span className="font-mono text-textWhite">Sync: {lastUpdated}</span>
          </div>

          <button className="relative p-1 text-textMuted hover:text-textWhite transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-saffronAccent rounded-full"></span>
          </button>

          <button className="flex items-center justify-center w-7 h-7 rounded-full border border-white/8 bg-white/5 hover:bg-white/10 hover:border-tealAccent/20 text-textMuted hover:text-textWhite transition-colors">
            <User className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};

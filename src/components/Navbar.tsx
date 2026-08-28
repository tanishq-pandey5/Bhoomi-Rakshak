import React from 'react';
import { Shield, Mountain, User } from 'lucide-react';

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
  lastUpdated: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo, lastUpdated }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-bgDark/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand logo & name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-tealAccent/10 border border-tealAccent/20 text-tealAccent">
            <Mountain className="w-5 h-5 absolute z-10 translate-y-[-2px]" />
            <Shield className="w-6 h-6 opacity-65" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-wider text-textWhite font-sans uppercase">
                Bhoomi Rakshak
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-tealAccent/10 border border-tealAccent/20 text-[9px] font-bold text-tealAccent uppercase tracking-widest">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-textMuted font-medium tracking-wide">
              Early Signals. Safer Hills.
            </p>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: 'Dashboard', id: 'dashboard' },
            { label: 'Risk Map', id: 'risk-map' },
            { label: 'Alerts', id: 'alerts' },
            { label: 'Methodology', id: 'methodology' },
            { label: 'About Us', id: 'footer' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className="text-sm font-medium text-textMuted hover:text-tealAccent transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Monitoring status & User profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 text-xs rounded bg-white/5 border border-white/8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 pulse-green-dot"></span>
            </span>
            <span className="hidden sm:inline text-textMuted font-semibold">Monitoring:</span>
            <span className="text-textWhite font-semibold">Live</span>
          </div>

          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[9px] text-textMuted uppercase font-bold tracking-wider">Telemetry Refresh</span>
            <span className="text-xs text-textWhite font-semibold">Sync: {lastUpdated}</span>
          </div>

          <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/8 bg-white/5 hover:bg-white/10 hover:border-tealAccent/30 text-textMuted hover:text-tealAccent transition-all duration-200">
            <User className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

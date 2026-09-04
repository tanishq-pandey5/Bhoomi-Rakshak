import React from 'react';
import { Shield, Mountain, User, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
  lastUpdated: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo, lastUpdated }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030B1C]/40 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-16 h-[72px] flex items-center justify-between">
        
        {/* Left: Brand logo & name */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative flex items-center justify-center w-9 h-9 rounded bg-[#08264A] border border-[#29A9FF]/20 text-[#29A9FF]">
            <Mountain className="w-4.5 h-4.5 absolute z-10 translate-y-[-2px]" />
            <Shield className="w-5.5 h-5.5 opacity-30" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-[#F5F7FB] uppercase block leading-none">
              Bhoomi Rakshak
            </span>
            <span className="text-[9px] text-[#71839C] font-bold tracking-wider uppercase block mt-1 leading-none">
              Early Signals. Safer Hills.
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Overview', id: 'dashboard' },
            { label: 'Risk Map', id: 'risk-map' },
            { label: 'Forecast', id: 'forecast-section' },
            { label: 'Alerts', id: 'alerts' },
            { label: 'Methodology', id: 'methodology' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className="text-[10px] font-bold text-[#A7B6CC] hover:text-[#29A9FF] tracking-widest uppercase transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}

          {/* Link to Live AI-GIS Dashboard */}
          <a
            href="http://localhost:8000"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-bold text-[#29A9FF] hover:text-white border border-[#29A9FF]/30 hover:border-[#29A9FF] bg-[#29A9FF]/10 hover:bg-[#29A9FF]/20 px-3 py-1.5 rounded-md tracking-widest uppercase transition-all flex items-center gap-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#29A9FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#29A9FF]"></span>
            </span>
            <span>Live GIS Dashboard</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </nav>

        {/* Right: Monitoring status & User profile */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#32D583] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#32D583] pulse-green-dot"></span>
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-[#32D583] uppercase font-bold tracking-wider leading-none">
                Live Monitoring
              </span>
              <span className="text-[8px] text-[#71839C] mt-0.5 leading-none font-medium">
                {lastUpdated || 'Updated 2 min ago'}
              </span>
            </div>
          </div>

          <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-[#08264A]/60 hover:bg-[#29A9FF]/10 hover:border-[#29A9FF]/30 text-[#A7B6CC] hover:text-[#29A9FF] transition-all duration-200">
            <User className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

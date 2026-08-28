import React from 'react';
import { Shield, Mountain, User } from 'lucide-react';

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
  lastUpdated: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo, lastUpdated }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030B1C]/75 backdrop-blur-lg">
      <div className="max-w-[1600px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Left: Brand logo & name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded bg-[#08264A] border border-[#29A9FF]/20 text-[#29A9FF]">
            <Mountain className="w-5 h-5 absolute z-10 translate-y-[-2px]" />
            <Shield className="w-6 h-6 opacity-40" />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-widest text-[#F5F7FA] uppercase block">
              Bhoomi Rakshak
            </span>
            <p className="text-[10px] text-[#71839C] font-semibold tracking-wider uppercase">
              Early Signals. Safer Hills.
            </p>
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
              className="text-xs font-semibold text-[#A7B6CC] hover:text-[#29A9FF] tracking-wider uppercase transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Monitoring status & User profile */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#32D583] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#32D583]"></span>
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-[#32D583] uppercase font-bold tracking-wider leading-none">
                Live Monitoring
              </span>
              <span className="text-[9px] text-[#71839C] mt-0.5 leading-none">
                Updated 2 min ago
              </span>
            </div>
          </div>

          <button className="flex items-center justify-center w-8 h-8 rounded-full border border-[#29A9FF]/20 bg-[#08264A] hover:bg-[#29A9FF]/10 hover:border-[#29A9FF] text-[#A7B6CC] hover:text-[#29A9FF] transition-all duration-200">
            <User className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

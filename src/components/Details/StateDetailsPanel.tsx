import React from 'react';
import type { StateRiskProfile } from '../../data/mockData';
import { getRiskColor } from '../../data/mockData';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface StateDetailsPanelProps {
  profile: StateRiskProfile;
}

export const StateDetailsPanel: React.FC<StateDetailsPanelProps> = ({ profile }) => {
  const riskColor = getRiskColor(profile.riskLevel);

  // Expanded SVG coordinates for large thin arc gauge
  const radius = 64;
  const strokeWidth = 5;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (profile.riskPercentage / 100) * strokeDasharray;

  return (
    <div className="glass-panel p-10 flex flex-col md:flex-row items-center justify-between gap-8 w-full h-full select-none border border-white/5">
      
      {/* Left Column: Region Labels */}
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
            Current Region
          </span>
          <h2 className="text-4xl font-extrabold text-[#F5F7FB] tracking-tight uppercase mt-1">
            {profile.name}
          </h2>
          <span className="text-xs text-[#A7B6CC] font-semibold block mt-1">
            {profile.region} Region
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {profile.riskTrend === 'Rising' ? (
            <span className="text-sm font-bold text-[#FF4D5A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4D5A] animate-pulse" />
              &uarr; 12% from previous forecast
            </span>
          ) : (
            <span className="text-sm font-bold text-[#32D583] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#32D583]" />
              &darr; 8% from previous forecast
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#71839C] font-semibold mt-4 pt-4 border-t border-white/5">
          <Clock className="w-4 h-4" />
          <span>Valid for: <strong className="text-[#F5F7FB] font-bold uppercase tracking-wider">Next 72 Hours</strong></span>
        </div>
      </div>

      {/* Right Column: Large Glowing Arc Gauge */}
      <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255, 255, 255, 0.02)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={riskColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {/* Main dominant risk percentage */}
          <span className="text-5xl font-black text-[#F5F7FB] font-mono leading-none tracking-tighter">
            {profile.riskPercentage}%
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest mt-2 leading-none" style={{ color: riskColor }}>
            {profile.riskLevel} Risk
          </span>
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import type { StateRiskProfile } from '../../data/mockData';
import { getRiskColor } from '../../data/mockData';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface StateDetailsPanelProps {
  profile: StateRiskProfile;
}

export const StateDetailsPanel: React.FC<StateDetailsPanelProps> = ({ profile }) => {
  const riskColor = getRiskColor(profile.riskLevel);

  // SVG calculations for circular arc progress
  const radius = 50;
  const strokeWidth = 8;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (profile.riskPercentage / 100) * strokeDasharray;

  return (
    <div className="glass-panel p-6 flex flex-row items-center justify-between gap-6 w-full h-full">
      
      {/* Left Column: Region Labels */}
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
            Current Region
          </span>
          <h2 className="text-2xl font-extrabold text-[#F5F7FA] tracking-wide uppercase mt-0.5">
            {profile.name}
          </h2>
          <span className="text-[10px] text-[#A7B6CC] font-semibold block mt-0.5">
            {profile.region} Region
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {profile.riskTrend === 'Rising' ? (
            <span className="text-xs font-bold text-[#FF4D5A] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" /> &uarr; 12% from previous forecast
            </span>
          ) : (
            <span className="text-xs font-bold text-[#32D583] flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> &darr; 8% from previous forecast
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#71839C] font-semibold mt-3 pt-3 border-t border-white/5">
          <Clock className="w-3.5 h-3.5" />
          <span>Valid for: <strong className="text-[#F5F7FA] font-bold uppercase">Next 72 Hours</strong></span>
        </div>
      </div>

      {/* Right Column: Glowing Arc Gauge */}
      <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="rgba(255, 255, 255, 0.02)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="56"
            cy="56"
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
          <span className="text-xl font-black text-[#F5F7FA] font-mono leading-none">
            {profile.riskPercentage}%
          </span>
          <span className="text-[7px] font-bold uppercase tracking-widest mt-1.5" style={{ color: riskColor }}>
            {profile.riskLevel} Risk
          </span>
        </div>
      </div>

    </div>
  );
};

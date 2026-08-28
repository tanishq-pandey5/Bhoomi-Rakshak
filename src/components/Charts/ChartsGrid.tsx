import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  ResponsiveContainer
} from 'recharts';
import type { StateRiskProfile } from '../../data/mockData';

interface ChartsGridProps {
  profile: StateRiskProfile;
}

export const ChartsGrid: React.FC<ChartsGridProps> = ({ profile }) => {
  // Chart 1: 72-Hour Risk Forecast Trend
  const riskData = profile.trendSeries.map(pt => ({
    time: pt.day,
    risk: pt.risk
  }));

  // Chart 2: Rainfall Forecast Data
  const rainfallData = profile.forecastSeries;

  // Custom Risk Tooltip
  const CustomRiskTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-3.5 py-2.5 text-xs flex flex-col gap-1 border border-[#29A9FF]/20 bg-[#06152B]/95">
          <p className="font-bold text-[#F5F7FA] font-mono border-b border-white/5 pb-1 mb-1">{label}</p>
          <p className="text-[#29A9FF] font-bold flex items-center justify-between gap-4">
            <span>Risk Probability:</span>
            <span className="font-mono">{payload[0].value}%</span>
          </p>
          <p className="text-[#55C7FF] font-semibold flex items-center justify-between gap-4">
            <span>Rainfall Intensity:</span>
            <span className="font-mono">{profile.rainfallIntensity} mm/hr</span>
          </p>
          <p className="text-[#32D583] font-semibold flex items-center justify-between gap-4">
            <span>Soil Moisture:</span>
            <span className="font-mono">{profile.soilMoisture}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Rainfall Tooltip
  const CustomRainfallTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-3.5 py-2.5 text-xs flex flex-col gap-1 border border-[#29A9FF]/20 bg-[#06152B]/95">
          <p className="font-bold text-[#F5F7FA] font-mono border-b border-white/5 pb-1 mb-1">{label}</p>
          <p className="text-[#55C7FF] font-bold flex items-center justify-between gap-4">
            <span>Accumulation:</span>
            <span className="font-mono">{payload[0].value} mm</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" id="forecast-section">
      
      {/* Chart 1: 72-Hour Risk Forecast */}
      <div className="glass-panel p-5 flex flex-col h-[300px] border border-[#29A9FF]/8">
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A7B6CC]">
            72-Hour Risk Forecast
          </h4>
          <p className="text-[10px] text-[#71839C] mt-0.5">
            Predicted landslide probability for {profile.name}.
          </p>
        </div>
        
        <div className="flex-1 w-full text-[10px] font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#29A9FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#29A9FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="time" stroke="#71839C" tickLine={false} />
              <YAxis stroke="#71839C" tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" />
              <Tooltip content={<CustomRiskTooltip />} />
              
              {/* Threshold line at 70% */}
              <ReferenceLine 
                y={70} 
                stroke="#FF8A3D" 
                strokeDasharray="4 4" 
                strokeWidth={1}
                label={{ value: 'High Risk Threshold (70%)', position: 'insideTopRight', fill: '#FF8A3D', fontSize: 8, fontWeight: 'bold' }} 
              />
              
              <Area 
                type="monotone" 
                dataKey="risk" 
                stroke="#29A9FF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#riskGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Rainfall Forecast */}
      <div className="glass-panel p-5 flex flex-col h-[300px] border border-[#29A9FF]/8">
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A7B6CC]">
            Rainfall Forecast (72 Hours)
          </h4>
          <p className="text-[10px] text-[#71839C] mt-0.5">
            72-hour rainfall prediction.
          </p>
        </div>
        
        <div className="flex-1 w-full text-[10px] font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rainfallData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#55C7FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#55C7FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="time" stroke="#71839C" tickLine={false} />
              <YAxis stroke="#71839C" tickLine={false} unit="mm" />
              <Tooltip content={<CustomRainfallTooltip />} />
              
              {/* Threshold line at 80mm */}
              <ReferenceLine 
                y={80} 
                stroke="#FF8A3D" 
                strokeDasharray="4 4" 
                strokeWidth={1}
                label={{ value: 'Heavy Rainfall Threshold', position: 'insideTopRight', fill: '#FF8A3D', fontSize: 8, fontWeight: 'bold' }} 
              />
              
              <Area 
                type="monotone" 
                dataKey="rainfall" 
                stroke="#55C7FF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#rainGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

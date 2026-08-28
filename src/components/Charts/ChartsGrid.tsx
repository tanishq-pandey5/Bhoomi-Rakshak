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

interface ChartProps {
  profile: StateRiskProfile;
}

// 1. 72-Hour Risk Forecast Chart (420px height)
export const RiskForecastChart: React.FC<ChartProps> = ({ profile }) => {
  const riskData = profile.trendSeries.map(pt => ({
    time: pt.day,
    risk: pt.risk
  }));

  const CustomRiskTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-4 py-3 text-xs flex flex-col gap-1 border border-[#29A9FF]/20 bg-[#06152B]/95 shadow-xl">
          <p className="font-bold text-[#F5F7FB] font-mono border-b border-white/5 pb-1 mb-1">{label}</p>
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

  return (
    <div className="flex flex-col gap-4 w-full" id="forecast-section">
      <div>
        <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
          AI-Powered Trend Analysis
        </span>
        <h3 className="text-2xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
          72-Hour Risk Forecast
        </h3>
        <p className="text-xs text-[#A7B6CC] mt-0.5">
          Predicted landslide probability for {profile.name}.
        </p>
      </div>

      <div className="w-full h-[420px] font-mono text-xs select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={riskData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#29A9FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#29A9FF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
            <XAxis dataKey="time" stroke="#71839C" tickLine={false} style={{ fontSize: '12px' }} />
            <YAxis stroke="#71839C" tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomRiskTooltip />} />
            
            <ReferenceLine 
              y={70} 
              stroke="#FF8A3D" 
              strokeDasharray="4 4" 
              strokeWidth={1}
              label={{ value: 'High Risk Threshold (70%)', position: 'insideTopRight', fill: '#FF8A3D', fontSize: 10, fontWeight: 'bold' }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="#29A9FF" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#riskGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 2. Rainfall Forecast Chart (360px height)
export const RainfallForecastChart: React.FC<ChartProps> = ({ profile }) => {
  const rainfallData = profile.forecastSeries;

  const CustomRainfallTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-4 py-3 text-xs flex flex-col gap-1 border border-[#29A9FF]/20 bg-[#06152B]/95 shadow-xl">
          <p className="font-bold text-[#F5F7FB] font-mono border-b border-white/5 pb-1 mb-1">{label}</p>
          <p className="text-[#55C7FF] font-bold flex items-center justify-between gap-4">
            <span>Rainfall Accumulation:</span>
            <span className="font-mono">{payload[0].value} mm</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
          Precipitation Outlook
        </span>
        <h3 className="text-2xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
          Rainfall Forecast (72 Hours)
        </h3>
        <p className="text-xs text-[#A7B6CC] mt-0.5">
          Forecasted water deposition over predictive horizon.
        </p>
      </div>

      <div className="w-full h-[360px] font-mono text-xs select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rainfallData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#55C7FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#55C7FF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
            <XAxis dataKey="time" stroke="#71839C" tickLine={false} style={{ fontSize: '12px' }} />
            <YAxis stroke="#71839C" tickLine={false} unit="mm" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomRainfallTooltip />} />
            
            <ReferenceLine 
              y={80} 
              stroke="#FF8A3D" 
              strokeDasharray="4 4" 
              strokeWidth={1}
              label={{ value: 'Heavy Rainfall Threshold', position: 'insideTopRight', fill: '#FF8A3D', fontSize: 10, fontWeight: 'bold' }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="rainfall" 
              stroke="#55C7FF" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#rainGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

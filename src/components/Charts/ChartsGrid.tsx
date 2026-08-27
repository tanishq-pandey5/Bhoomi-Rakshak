import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { getRiskColor } from '../../data/mockData';
import type { StateRiskProfile } from '../../data/mockData';
import { Info, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface ChartsGridProps {
  profile: StateRiskProfile;
}

export const ChartsGrid: React.FC<ChartsGridProps> = ({ profile }) => {
  const riskColor = getRiskColor(profile.riskLevel);

  // Compute a dynamic 72-Hour Risk Outlook timeline based on state risk level & trend
  const simulatedRiskTimeline = useMemo(() => {
    const base = profile.riskPercentage;
    const trend = profile.riskTrend;
    let p0 = base, p24 = base, p48 = base, p72 = base;

    if (trend === 'Rising') {
      p0 = Math.max(10, Math.round(base * 0.72));
      p24 = Math.max(15, Math.round(base * 0.83));
      p48 = Math.max(20, Math.round(base * 0.91));
      p72 = base;
    } else if (trend === 'Falling') {
      p0 = base;
      p24 = Math.max(5, Math.round(base * 0.85));
      p48 = Math.max(5, Math.round(base * 0.70));
      p72 = Math.max(5, Math.round(base * 0.55));
    } else {
      p0 = Math.max(5, base - 3);
      p24 = base;
      p48 = Math.max(5, base + 2);
      p72 = Math.max(5, base - 1);
    }

    return [
      { name: 'NOW', risk: p0 },
      { name: '24H', risk: p24 },
      { name: '48H', risk: p48 },
      { name: '72H', risk: p72 }
    ];
  }, [profile.riskPercentage, profile.riskTrend]);

  // Forecast data for rainfall
  const rainfallData = profile.forecastSeries;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label, suffix = '' }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B2030] border border-white/10 px-3 py-1.5 rounded text-[11px] shadow-2xl flex flex-col gap-0.5">
          <p className="font-bold text-textWhite font-mono">{label}</p>
          <p className="text-tealAccent font-black font-mono">
            {payload[0].value}
            <span className="text-[9px] text-textMuted font-medium font-sans ml-0.5">{suffix}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 w-full py-2">
      
      {/* Primary Section: 72H Risk Outlook Chart */}
      <div className="flex flex-col gap-4">
        
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div>
            <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
              Hazard Trend Prediction
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-textWhite uppercase tracking-wide">
                72-Hour Risk Outlook
              </h3>
              <span className="text-[9px] font-mono text-textMuted uppercase font-bold tracking-widest bg-white/5 px-2 py-0.5 rounded">
                SIMULATED RISK DATA
              </span>
            </div>
          </div>

          {/* Trend status flag */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-textMuted">Outlook Trend:</span>
            {profile.riskTrend === 'Rising' ? (
              <span className="text-riskCritical flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 animate-bounce" /> INCREASING
              </span>
            ) : profile.riskTrend === 'Falling' ? (
              <span className="text-riskVeryLow flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> DECREASING
              </span>
            ) : (
              <span className="text-textMuted uppercase">STABLE</span>
            )}
          </div>
        </div>

        {/* Chart Graphic Area */}
        <div className="w-full h-56 text-[10px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulatedRiskTimeline} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={riskColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={riskColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#8FA6B8" tickLine={false} />
              <YAxis stroke="#8FA6B8" tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip suffix="%" />} />
              
              <ReferenceLine 
                y={75} 
                stroke="var(--risk-red)" 
                strokeDasharray="4 4" 
                opacity={0.5}
                label={{ value: 'HIGH RISK THRESHOLD (75%)', fill: 'var(--risk-red)', fontSize: 7, fontWeight: 'bold', position: 'insideTopLeft' }} 
              />
              
              <Area 
                type="monotone" 
                dataKey="risk" 
                stroke={riskColor} 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#riskGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Chart: Rainfall Accumulation Forecast */}
      <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
        <div>
          <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
            Hydrological Input
          </span>
          <h3 className="text-base font-extrabold text-textWhite uppercase tracking-wide">
            72-Hour Cumulative Rainfall Forecast
          </h3>
          <p className="text-[10px] text-textMuted mt-0.5">
            Forecasted cumulative water deposition in millimeters over predictive horizon
          </p>
        </div>

        <div className="w-full h-48 text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rainfallData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16B8A6" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#16B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="time" stroke="#8FA6B8" tickLine={false} />
              <YAxis stroke="#8FA6B8" tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" mm" />} />
              <Area 
                type="monotone" 
                dataKey="rainfall" 
                stroke="#16B8A6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#rainGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

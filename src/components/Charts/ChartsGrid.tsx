import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getRiskColor } from '../../data/mockData';
import type { StateRiskProfile } from '../../data/mockData';

interface ChartsGridProps {
  profile: StateRiskProfile;
}

export const ChartsGrid: React.FC<ChartsGridProps> = ({ profile }) => {
  const riskColor = getRiskColor(profile.riskLevel);

  // Chart 1: Rainfall Forecast Data
  const forecastData = profile.forecastSeries;

  // Chart 2: Parameter Contributions
  const contributionsData = [
    { name: 'Rainfall', value: profile.contributions.rainfall, color: '#16B8A6' },
    { name: 'Soil Moisture', value: profile.contributions.soilMoisture, color: '#FACC15' },
    { name: 'Slope Topo', value: profile.contributions.slope, color: '#F97316' },
    { name: 'Lithology', value: profile.contributions.lithology, color: '#84CC16' },
    { name: 'Historical Slides', value: profile.contributions.historicalEvents, color: '#EF4444' },
    { name: 'Vibration Sensors', value: profile.contributions.sensorVibration, color: '#FF9F43' }
  ].sort((a, b) => b.value - a.value); // Sort descending

  // Chart 3: 7-Day Trend
  const trendData = profile.trendSeries;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label, suffix = '' }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-3 py-2 text-xs flex flex-col gap-0.5">
          <p className="font-semibold text-textWhite">{label}</p>
          <p className="text-tealAccent font-bold font-mono">
            {payload[0].value}
            <span className="text-[10px] text-textMuted font-normal ml-0.5">{suffix}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      
      {/* Chart 1: Rainfall Forecast */}
      <div className="glass-panel p-5 flex flex-col h-[340px]">
        <div className="mb-4">
          <h4 className="text-sm font-semibold tracking-wide text-textWhite">72-Hour Cumulative Rainfall Forecast</h4>
          <p className="text-[11px] text-textMuted">Forecasted water deposition over predictive horizon</p>
        </div>
        
        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16B8A6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#9FB3C8" tickLine={false} />
              <YAxis stroke="#9FB3C8" tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" mm" />} />
              
              {/* Rainfall warning threshold line at 50mm */}
              <ReferenceLine 
                y={80} 
                stroke="#EF4444" 
                strokeDasharray="4 4" 
                label={{ value: 'Warning Thr. (80mm)', position: 'insideTopRight', fill: '#EF4444', fontSize: 9, fontWeight: 'bold' }} 
              />
              
              <Area 
                type="monotone" 
                dataKey="rainfall" 
                stroke="#16B8A6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#rainGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Contribution Bar Chart */}
      <div className="glass-panel p-5 flex flex-col h-[340px]">
        <div className="mb-4">
          <h4 className="text-sm font-semibold tracking-wide text-textWhite">Risk Parameter Contribution</h4>
          <p className="text-[11px] text-textMuted">Weight breakdown of hazard trigger factors (%)</p>
        </div>

        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={contributionsData} 
              layout="vertical"
              margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis type="number" stroke="#9FB3C8" tickLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#9FB3C8" 
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomTooltip suffix="%" />} />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
                barSize={12}
              >
                {contributionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Recent Risk Trend */}
      <div className="glass-panel p-5 flex flex-col h-[340px] lg:col-span-2 xl:col-span-1">
        <div className="mb-4">
          <h4 className="text-sm font-semibold tracking-wide text-textWhite">Recent Risk Index Trend</h4>
          <p className="text-[11px] text-textMuted">Composite landslide threat levels for previous 7 days</p>
        </div>

        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#9FB3C8" tickLine={false} />
              <YAxis stroke="#9FB3C8" tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip suffix="%" />} />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke={riskColor} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: '#071A2B' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: riskColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Sparkles, CloudRain, Droplets, Triangle, Activity } from 'lucide-react';

export const RiskSimulator: React.FC = () => {
  const [rain, setRain] = useState(35);
  const [moisture, setMoisture] = useState(65);
  const [slope, setSlope] = useState(32);
  const [seismic, setSeismic] = useState(2.5);

  // Compute simulated risk index using typical weights
  const simulatedRisk = useMemo(() => {
    const rScore = (rain / 80) * 35;
    const mScore = (moisture / 100) * 25;
    const sScore = (slope / 60) * 25;
    const gScore = (seismic / 10) * 15;
    return Math.min(100, Math.max(5, Math.round(rScore + mScore + sScore + gScore)));
  }, [rain, moisture, slope, seismic]);

  const { level, color } = useMemo(() => {
    if (simulatedRisk >= 85) return { level: 'Critical', color: 'text-riskCritical bg-riskCritical/10 border-riskCritical/20' };
    if (simulatedRisk >= 70) return { level: 'High', color: 'text-riskHigh bg-riskHigh/10 border-riskHigh/20' };
    if (simulatedRisk >= 50) return { level: 'Elevated', color: 'text-riskModerate bg-riskModerate/10 border-riskModerate/20' };
    if (simulatedRisk >= 30) return { level: 'Watch', color: 'text-saffronAccent bg-saffronAccent/10 border-saffronAccent/20' };
    return { level: 'Normal', color: 'text-riskVeryLow bg-riskVeryLow/10 border-riskVeryLow/20' };
  }, [simulatedRisk]);

  // Compute dynamic points for the mini 72h forecast chart based on the simulation
  const chartPoints = useMemo(() => {
    const base = simulatedRisk;
    const p1 = Math.max(5, Math.round(base * 0.65));
    const p2 = Math.max(5, Math.round(base * 0.8));
    const p3 = Math.max(5, Math.round(base * 0.9));
    const p4 = base;
    
    // Map percentages to y-coordinates in a 180x60 SVG canvas
    const getY = (val: number) => 50 - (val / 100) * 40;
    
    const y1 = getY(p1);
    const y2 = getY(p2);
    const y3 = getY(p3);
    const y4 = getY(p4);
    
    return {
      path: `M 15 ${y1} Q 55 ${y2} 95 ${y3} T 165 ${y4}`,
      p1, p2, p3, p4,
      y1, y2, y3, y4
    };
  }, [simulatedRisk]);

  return (
    <div className="flex flex-col gap-5 w-full py-2">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
            Sandbox Environment
          </span>
          <h3 className="text-base font-extrabold text-textWhite uppercase tracking-wide">
            Risk Simulator
          </h3>
          <p className="text-[11px] text-textMuted mt-0.5">
            Explore how custom environmental parameters influence predicted landslide probability
          </p>
        </div>

        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-tealAccent bg-tealAccent/10 border border-tealAccent/20 rounded">
          <Sparkles className="w-3 h-3" />
          <span>Demo Simulation</span>
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Sliders Area (Left 7 Cols) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          
          {/* Rainfall Intensity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-semibold text-textWhite">
              <span className="flex items-center gap-2 text-textMuted">
                <CloudRain className="w-3.5 h-3.5 text-tealAccent" />
                <span className="uppercase tracking-wide font-bold">Rainfall Rate</span>
              </span>
              <span className="font-mono text-tealAccent">{rain} mm/hr</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="80" 
              value={rain} 
              onChange={(e) => setRain(Number(e.target.value))}
              className="w-full accent-tealAccent bg-white/5 h-1 rounded-full cursor-pointer"
            />
          </div>

          {/* Soil Moisture */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-semibold text-textWhite">
              <span className="flex items-center gap-2 text-textMuted">
                <Droplets className="w-3.5 h-3.5 text-tealAccent" />
                <span className="uppercase tracking-wide font-bold">Soil Moisture</span>
              </span>
              <span className="font-mono text-tealAccent">{moisture}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={moisture} 
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full accent-tealAccent bg-white/5 h-1 rounded-full cursor-pointer"
            />
          </div>

          {/* Slope Angle */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-semibold text-textWhite">
              <span className="flex items-center gap-2 text-textMuted">
                <Triangle className="w-3.5 h-3.5 text-saffronAccent" />
                <span className="uppercase tracking-wide font-bold">Slope Angle</span>
              </span>
              <span className="font-mono text-saffronAccent">{slope}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="60" 
              value={slope} 
              onChange={(e) => setSlope(Number(e.target.value))}
              className="w-full accent-saffronAccent bg-white/5 h-1 rounded-full cursor-pointer"
            />
          </div>

          {/* Seismic Activity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-semibold text-textWhite">
              <span className="flex items-center gap-2 text-textMuted">
                <Activity className="w-3.5 h-3.5 text-riskCritical" />
                <span className="uppercase tracking-wide font-bold">Vibration Baseline</span>
              </span>
              <span className="font-mono text-riskCritical">{seismic.toFixed(1)} mm/s</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.5"
              value={seismic} 
              onChange={(e) => setSeismic(Number(e.target.value))}
              className="w-full accent-riskCritical bg-white/5 h-1 rounded-full cursor-pointer"
            />
          </div>

        </div>

        {/* Readout Output (Right 5 Cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-l border-white/5 pl-0 md:pl-8 py-2">
          
          <div className="text-center">
            <span className="text-[9px] text-textMuted uppercase font-bold tracking-widest block">
              Simulated Hazard Index
            </span>
            <h4 className="text-5xl font-black font-mono tracking-tight mt-1 text-textWhite leading-none">
              {simulatedRisk}%
            </h4>
            <span className={`inline-block mt-3 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider border ${color}`}>
              {level} Status
            </span>
          </div>

          {/* Mini 72h graph output */}
          <div className="w-full mt-6 flex flex-col gap-2">
            <span className="text-[9px] text-textMuted uppercase font-bold tracking-widest text-center">
              Simulated 72H Trend
            </span>
            
            <div className="w-full h-16 flex items-center justify-center">
              <svg className="w-48 h-12 overflow-visible">
                {/* Area under curve */}
                <path 
                  d={`${chartPoints.path} L 165 50 L 15 50 Z`} 
                  fill="url(#sim-gradient)" 
                  opacity="0.12" 
                />
                
                {/* Curve path */}
                <path 
                  d={chartPoints.path} 
                  fill="none" 
                  stroke="var(--teal)" 
                  strokeWidth="1.5"
                  strokeLinecap="round" 
                />

                {/* Nodes */}
                <circle cx="15" cy={chartPoints.y1} r="2" fill="var(--teal)" />
                <circle cx="65" cy={chartPoints.y2} r="2" fill="var(--teal)" />
                <circle cx="115" cy={chartPoints.y3} r="2" fill="var(--teal)" />
                <circle cx="165" cy={chartPoints.y4} r="3" fill="var(--teal)" className="animate-pulse" />
                
                {/* Labels */}
                <text x="15" y="48" fill="#8FA6B8" fontSize="7" textAnchor="middle">NOW</text>
                <text x="65" y="48" fill="#8FA6B8" fontSize="7" textAnchor="middle">24H</text>
                <text x="115" y="48" fill="#8FA6B8" fontSize="7" textAnchor="middle">48H</text>
                <text x="165" y="48" fill="#8FA6B8" fontSize="7" textAnchor="middle">72H</text>

                <defs>
                  <linearGradient id="sim-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--teal)" />
                    <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

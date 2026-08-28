import React, { useState } from 'react';
import type { StateRiskProfile } from '../../data/mockData';
import { getRiskColor } from '../../data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Clock, 
  Info, 
  AlertTriangle,
  Brain,
  Layers,
  Thermometer,
  Compass,
  X,
  CloudRain,
  Droplets,
  Triangle,
  Activity
} from 'lucide-react';

interface StateDetailsPanelProps {
  profile: StateRiskProfile;
}

export const StateDetailsPanel: React.FC<StateDetailsPanelProps> = ({ profile }) => {
  const [showModal, setShowModal] = useState(false);
  const riskColor = getRiskColor(profile.riskLevel);

  // Dynamic risk trend icon
  const getTrendIcon = () => {
    switch (profile.riskTrend) {
      case 'Rising':
        return <TrendingUp className="w-4 h-4 text-riskVeryHigh" />;
      case 'Falling':
        return <TrendingDown className="w-4 h-4 text-riskVeryLow" />;
      default:
        return <Minus className="w-4 h-4 text-textMuted" />;
    }
  };

  // Determine top drivers based on contributions
  const getDriversList = () => {
    const contr = profile.contributions;
    const sorted = Object.entries(contr).sort((a, b) => b[1] - a[1]);
    return sorted.map(([key, val]) => {
      let name = 'Other';
      let Icon = Info;
      let color = 'text-textMuted';
      
      if (key === 'rainfall') {
        name = 'Rainfall';
        Icon = CloudRain;
        color = 'text-tealAccent';
      } else if (key === 'soilMoisture') {
        name = 'Soil Moisture';
        Icon = Droplets;
        color = 'text-riskLow';
      } else if (key === 'slope') {
        name = 'Slope Angle';
        Icon = Triangle;
        color = 'text-saffronAccent';
      } else if (key === 'sensorVibration') {
        name = 'Recent Vibration';
        Icon = Activity;
        color = 'text-riskVeryHigh';
      } else if (key === 'historicalEvents') {
        name = 'Historical Slides';
        Icon = Clock;
        color = 'text-riskVeryHigh';
      } else if (key === 'lithology') {
        name = 'Lithology';
        Icon = Layers;
        color = 'text-riskLow';
      }

      return { name, val, Icon, color };
    });
  };

  const drivers = getDriversList().slice(0, 4); // top 4 drivers

  // Circular gauge SVG calculations
  const radius = 62;
  const innerRadius = radius - 12;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * innerRadius;
  const strokeDashoffset = circumference - (profile.riskPercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 w-full h-full">
      
      {/* CARD 1: Selected State Risk Profile */}
      <div className="glass-panel p-5 flex flex-col gap-4 justify-between">
        <div>
          <span className="text-[10px] text-textMuted uppercase font-bold tracking-widest block">
            Selected State Risk Profile
          </span>
          <h2 className="text-2xl font-black text-textWhite tracking-tight mt-1 uppercase">
            {profile.name}
          </h2>
          <span className="text-[10px] text-textMuted font-medium block mt-0.5">
            {profile.region} Region
          </span>
          
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-black font-mono" style={{ color: riskColor }}>
              {profile.riskPercentage}%
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wide" style={{ color: riskColor }}>
                {profile.riskLevel} Risk
              </span>
              <span className="text-[10px] text-textMuted flex items-center gap-1 mt-0.5">
                {getTrendIcon()}
                <span className="capitalize">{profile.riskTrend} Trend</span>
              </span>
            </div>
          </div>
 
          <div className="flex items-center gap-1.5 text-[10px] text-tealAccent font-semibold mt-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Forecast Valid for next 72 hours</span>
          </div>
 
          {/* Warning Advisory box */}
          <div 
            className="mt-4 p-3 rounded-lg border text-[11px] leading-relaxed flex gap-2"
            style={{ 
              backgroundColor: `${riskColor}0A`, 
              borderColor: `${riskColor}22`,
              color: '#F5F7FA'
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: riskColor }} />
            <p className="font-medium text-textWhite">{profile.alertMessage}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] text-textMuted pt-2 border-t border-white/5 mt-auto">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated {profile.lastUpdated}
          </span>
        </div>
      </div>

      {/* CARD 2: Risk Score & Circular Gauge */}
      <div className="glass-panel p-5 flex flex-col justify-between gap-4">
        <div>
          <span className="text-[10px] text-textMuted uppercase font-bold tracking-widest block">
            Risk Score
          </span>
          
          <div className="flex flex-row items-center justify-between gap-4 mt-3">
            
            {/* Circle progress gauge */}
            <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={innerRadius}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth={strokeWidth - 2}
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={innerRadius}
                  stroke={riskColor}
                  strokeWidth={strokeWidth - 2}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-textWhite font-mono leading-none">
                  {profile.riskPercentage}%
                </span>
                <span className="text-[8px] text-textMuted uppercase font-bold tracking-wider mt-0.5">
                  Index
                </span>
              </div>
            </div>

            {/* Drivers list on the right */}
            <div className="flex-1 flex flex-col gap-2">
              <span className="text-[9px] text-textMuted uppercase font-bold tracking-wider block">
                Primary Risk Drivers
              </span>
              <div className="flex flex-col gap-1.5">
                {drivers.map((drv, idx) => {
                  const Icon = drv.Icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-textWhite">
                      <Icon className={`w-3.5 h-3.5 ${drv.color}`} />
                      <span className="font-semibold">{drv.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5 mt-auto">
          <button 
            onClick={() => setShowModal(true)}
            className="text-left text-xs font-bold text-tealAccent hover:underline flex items-center gap-1"
          >
            How is this calculated?
          </button>
        </div>
      </div>

      {/* METHODOLOGY EXPLANATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bgDark/85 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel border-white/20 w-full max-w-lg p-6 relative flex flex-col shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-textMuted hover:text-textWhite"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="p-2 rounded-xl bg-tealAccent/15 border border-tealAccent/20 text-tealAccent">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-textWhite">Landslide Risk Calculation</h3>
                <p className="text-xs text-textMuted">Bhoomi Rakshak ML Prediction Pipeline v2.0</p>
              </div>
            </div>

            {/* Model Weight Content */}
            <div className="flex flex-col gap-4 text-xs text-textMuted leading-relaxed">
              <p>
                The overall landslide probability is computed dynamically using a localized **Gradient Boosted Decision Tree (GBDT)** model combined with physics-based slope safety factor calculations.
              </p>

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] uppercase font-bold text-textWhite tracking-wider block">
                  Model Feature Weights Configuration
                </span>
                
                {[
                  { name: 'Rainfall Indicators (35%)', desc: 'Precipitation intensity, 24-hour weight, 7-day accumulation and 72-hour forecast overlays.', icon: Thermometer },
                  { name: 'Soil & Terrain Saturation (25%)', desc: 'Telemetry sensor soil moisture %, clay depth profiles, and drainage flow densities.', icon: Layers },
                  { name: 'Slope Topography (20%)', desc: 'Physics-based shear stress calculations matching slope angle and local elevations.', icon: Compass },
                  { name: 'Seismic Telemetry & Historical (20%)', desc: 'Real-time telemetry geophone sensor micro-vibrations and previous slide incidents.', icon: AlertTriangle }
                ].map((wt, idx) => (
                  <div key={idx} className="flex gap-3 p-2.5 rounded-lg bg-white/5 border border-white/8">
                    <wt.icon className="w-4 h-4 text-tealAccent mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-textWhite block">{wt.name}</span>
                      <span className="text-[10px] mt-0.5 block">{wt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 rounded-lg border border-tealAccent/20 bg-tealAccent/5 flex gap-2">
                <Info className="w-4 h-4 text-tealAccent shrink-0 mt-0.5" />
                <p className="text-[10px] text-tealAccent leading-normal">
                  <strong>Prediction Confidence:</strong> The model currently reports a 94.2% Area Under Curve (AUC) score based on testing against 800+ historical landslide events in the Western Ghats and Himalayan regions.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

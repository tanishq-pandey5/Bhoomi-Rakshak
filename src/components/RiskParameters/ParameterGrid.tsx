import React from 'react';
import type { StateRiskProfile } from '../../data/mockData';
import { 
  CloudRain, 
  Droplets, 
  Triangle, 
  Activity, 
  Layers, 
  Waves, 
  AlertOctagon, 
  Compass, 
  History,
  Spline,
  GitCommit
} from 'lucide-react';

interface ParameterGridProps {
  profile: StateRiskProfile;
}

interface ParameterConfig {
  name: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
  max: number; // for progress bar percentage
  label: 'Safe' | 'Watch' | 'Elevated' | 'Critical';
  colorClass: string;
  contribution: string; // weight factor percentage from screenshot
}

export const ParameterGrid: React.FC<ParameterGridProps> = ({ profile }) => {
  
  // Helper to determine status and colors dynamically
  const getParamConfig = (key: string): ParameterConfig => {
    switch (key) {
      case 'rainfallIntensity': {
        const val = profile.rainfallIntensity;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 45) label = 'Critical';
        else if (val >= 25) label = 'Elevated';
        else if (val >= 10) label = 'Watch';
        return {
          name: 'Rainfall Intensity',
          value: val,
          unit: 'mm/hr',
          icon: CloudRain,
          max: 80,
          label,
          colorClass: getLabelColor(label),
          contribution: '+18%'
        };
      }
      case 'rainfall24h': {
        const val = profile.rainfall24h;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 150) label = 'Critical';
        else if (val >= 100) label = 'Elevated';
        else if (val >= 50) label = 'Watch';
        return {
          name: '24-Hour Rainfall',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 250,
          label,
          colorClass: getLabelColor(label),
          contribution: '+22%'
        };
      }
      case 'rainfall7d': {
        const val = profile.rainfall7d;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 500) label = 'Critical';
        else if (val >= 300) label = 'Elevated';
        else if (val >= 150) label = 'Watch';
        return {
          name: '7-Day Accumulation',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 800,
          label,
          colorClass: getLabelColor(label),
          contribution: '+16%'
        };
      }
      case 'rainfall72hForecast': {
        const val = profile.rainfall72hForecast;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 180) label = 'Critical';
        else if (val >= 120) label = 'Elevated';
        else if (val >= 60) label = 'Watch';
        return {
          name: '72H Rain Forecast',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 300,
          label,
          colorClass: getLabelColor(label),
          contribution: '+14%'
        };
      }
      case 'soilMoisture': {
        const val = profile.soilMoisture;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 80) label = 'Critical';
        else if (val >= 60) label = 'Elevated';
        else if (val >= 40) label = 'Watch';
        return {
          name: 'Soil Moisture',
          value: val,
          unit: '%',
          icon: Droplets,
          max: 100,
          label,
          colorClass: getLabelColor(label),
          contribution: '+12%'
        };
      }
      case 'slopeAngle': {
        const val = profile.slopeAngle;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 35) label = 'Critical';
        else if (val >= 25) label = 'Elevated';
        else if (val >= 15) label = 'Watch';
        return {
          name: 'Slope Angle',
          value: val,
          unit: '°',
          icon: Triangle,
          max: 60,
          label,
          colorClass: getLabelColor(label),
          contribution: '+10%'
        };
      }
      case 'soilDepth': {
        const val = profile.soilDepth;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 3.0) label = 'Critical';
        else if (val >= 2.0) label = 'Elevated';
        else if (val >= 1.0) label = 'Watch';
        return {
          name: 'Soil Depth',
          value: val,
          unit: 'm',
          icon: Layers,
          max: 5.0,
          label,
          colorClass: getLabelColor(label),
          contribution: '+6%'
        };
      }
      case 'elevation': {
        const val = profile.elevation;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 2200) label = 'Critical';
        else if (val >= 1200) label = 'Elevated';
        else if (val >= 500) label = 'Watch';
        return {
          name: 'Elevation',
          value: val,
          unit: 'm',
          icon: Compass,
          max: 4000,
          label,
          colorClass: getLabelColor(label),
          contribution: '+4%'
        };
      }
      case 'distanceToStream': {
        const val = profile.distanceToStream;
        let label: ParameterConfig['label'] = 'Safe';
        if (val < 100) label = 'Critical';
        else if (val < 200) label = 'Elevated';
        else if (val < 350) label = 'Watch';
        return {
          name: 'Distance to Stream',
          value: val,
          unit: 'm',
          icon: Waves,
          max: 600,
          label,
          colorClass: getLabelColor(label),
          contribution: '+3%'
        };
      }
      case 'drainageDensity': {
        const val = profile.drainageDensity;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 4.0) label = 'Critical';
        else if (val >= 3.0) label = 'Elevated';
        else if (val >= 2.0) label = 'Watch';
        return {
          name: 'Drainage Density',
          value: val,
          unit: 'km/km²',
          icon: Spline,
          max: 6.0,
          label,
          colorClass: getLabelColor(label),
          contribution: '+3%'
        };
      }
      case 'historicalLandslides': {
        const val = profile.historicalLandslides;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 30) label = 'Critical';
        else if (val >= 15) label = 'Elevated';
        else if (val >= 5) label = 'Watch';
        return {
          name: 'Historical Landslides',
          value: val,
          unit: ' events',
          icon: History,
          max: 60,
          label,
          colorClass: getLabelColor(label),
          contribution: '+7%'
        };
      }
      case 'crackReports': {
        const val = profile.crackReports;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 9) label = 'Critical';
        else if (val >= 4) label = 'Elevated';
        else if (val >= 1) label = 'Watch';
        return {
          name: 'Slope Crack Reports',
          value: val,
          unit: ' locations',
          icon: AlertOctagon,
          max: 30,
          label,
          colorClass: getLabelColor(label),
          contribution: '+4%'
        };
      }
      case 'sensorVibration': {
        const val = profile.sensorVibration;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 5.0) label = 'Critical';
        else if (val >= 3.0) label = 'Elevated';
        else if (val >= 1.5) label = 'Watch';
        return {
          name: 'Sensor Vibration',
          value: val,
          unit: 'mm/s',
          icon: Activity,
          max: 10,
          label,
          colorClass: getLabelColor(label),
          contribution: '+3%'
        };
      }
      case 'seismicityIndex': {
        const val = profile.seismicityIndex;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 7.0) label = 'Critical';
        else if (val >= 5.0) label = 'Elevated';
        else if (val >= 3.0) label = 'Watch';
        return {
          name: 'Seismicity Index',
          value: val,
          unit: '/10',
          icon: GitCommit,
          max: 10,
          label,
          colorClass: getLabelColor(label),
          contribution: '+2%'
        };
      }
      default:
        throw new Error(`Unknown parameter key ${key}`);
    }
  };

  const getLabelColor = (label: ParameterConfig['label']) => {
    switch (label) {
      case 'Critical': return 'bg-riskCritical/20 text-riskVeryHigh border-riskCritical/30';
      case 'Elevated': return 'bg-riskHigh/20 text-riskHigh border-riskHigh/30';
      case 'Watch': return 'bg-riskModerate/20 text-riskModerate border-riskModerate/30';
      default: return 'bg-riskVeryLow/20 text-riskVeryLow border-riskVeryLow/30';
    }
  };

  const paramKeys = [
    'rainfallIntensity', 'rainfall24h', 'rainfall7d', 'rainfall72hForecast',
    'soilMoisture', 'slopeAngle', 'soilDepth', 'elevation',
    'distanceToStream', 'drainageDensity', 'historicalLandslides', 'crackReports',
    'sensorVibration', 'seismicityIndex'
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-wide text-textWhite">Telemetry & Terrain Parameter Feed</h3>
          <p className="text-xs text-textMuted mt-0.5">Real-time localized geotechnical sensor array readings</p>
        </div>
      </div>

      {/* Grid of 14 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {paramKeys.map(key => {
          const config = getParamConfig(key);
          const Icon = config.icon;
          
          let progressPercent = Math.min(100, (config.value / config.max) * 100);
          if (key === 'distanceToStream') {
            progressPercent = Math.max(0, 100 - (config.value / config.max) * 100);
          }

          return (
            <div key={key} className="glass-panel p-4 flex flex-col gap-3 glass-panel-hover">
              {/* Card Header: Icon + Status */}
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/5 border border-white/8 text-textMuted">
                  <Icon className="w-4 h-4 text-tealAccent" />
                </div>
                
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${config.colorClass}`}>
                  {config.label}
                </span>
              </div>

              {/* Title & Numeric Value */}
              <div>
                <span className="text-[10px] text-textMuted uppercase font-semibold tracking-wider block">
                  {config.name}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-textWhite font-mono">
                    {config.value}
                  </span>
                  <span className="text-xs text-textMuted font-medium font-sans">
                    {config.unit}
                  </span>
                </div>
              </div>

              {/* Progress bar and contribution percentage */}
              <div className="mt-auto flex flex-col gap-2">
                <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${progressPercent}%`,
                      backgroundColor: 
                        config.label === 'Critical' ? '#EF4444' : 
                        config.label === 'Elevated' ? '#F97316' : 
                        config.label === 'Watch' ? '#FACC15' : '#22C55E'
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-textMuted font-mono">
                  <span>Weight Factor</span>
                  <span className={
                    config.label === 'Critical' ? 'text-riskVeryHigh font-bold' :
                    config.label === 'Elevated' ? 'text-riskHigh font-bold' :
                    config.label === 'Watch' ? 'text-riskModerate font-bold' : 'text-riskVeryLow font-bold'
                  }>{config.contribution}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

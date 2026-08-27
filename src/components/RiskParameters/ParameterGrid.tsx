import React, { useState } from 'react';
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
  GitCommit,
  ChevronDown
} from 'lucide-react';

interface ParameterGridProps {
  profile: StateRiskProfile;
}

interface ParameterConfig {
  key: string;
  name: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
  max: number;
  label: 'Normal' | 'Watch' | 'Elevated' | 'Critical';
  contribution: string;
  description: string;
}

export const ParameterGrid: React.FC<ParameterGridProps> = ({ profile }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // Helper to determine status and configurations dynamically
  const getParamConfig = (key: string): ParameterConfig => {
    switch (key) {
      case 'rainfallIntensity': {
        const val = profile.rainfallIntensity;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 45) label = 'Critical';
        else if (val >= 25) label = 'Elevated';
        else if (val >= 10) label = 'Watch';
        return {
          key,
          name: 'Rainfall Intensity',
          value: val,
          unit: 'mm/hr',
          icon: CloudRain,
          max: 80,
          label,
          contribution: '+18%',
          description: 'High precipitation intensity directly increases transient pore water pressure along soil interfaces, reducing shear strength.'
        };
      }
      case 'rainfall24h': {
        const val = profile.rainfall24h;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 150) label = 'Critical';
        else if (val >= 100) label = 'Elevated';
        else if (val >= 50) label = 'Watch';
        return {
          key,
          name: '24-Hour Accumulation',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 250,
          label,
          contribution: '+22%',
          description: 'Total daily precipitation volume. Controls the overall soil moisture saturation trend across vulnerable slopes.'
        };
      }
      case 'rainfall7d': {
        const val = profile.rainfall7d;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 500) label = 'Critical';
        else if (val >= 300) label = 'Elevated';
        else if (val >= 150) label = 'Watch';
        return {
          key,
          name: '7-Day Accumulation',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 800,
          label,
          contribution: '+16%',
          description: 'Antecedent precipitation over one week. Correlates directly with deep-seated groundwater level rises.'
        };
      }
      case 'rainfall72hForecast': {
        const val = profile.rainfall72hForecast;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 180) label = 'Critical';
        else if (val >= 120) label = 'Elevated';
        else if (val >= 60) label = 'Watch';
        return {
          key,
          name: '72H Forecast Output',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 300,
          label,
          contribution: '+14%',
          description: 'Predicted rain volumes from regional meteorological models used as advance threat indicators.'
        };
      }
      case 'soilMoisture': {
        const val = profile.soilMoisture;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 80) label = 'Critical';
        else if (val >= 60) label = 'Elevated';
        else if (val >= 40) label = 'Watch';
        return {
          key,
          name: 'Soil Moisture Saturation',
          value: val,
          unit: '%',
          icon: Droplets,
          max: 100,
          label,
          contribution: '+12%',
          description: 'Percentage of water filled void spaces in soil. High values indicate severe liquefaction risk.'
        };
      }
      case 'slopeAngle': {
        const val = profile.slopeAngle;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 35) label = 'Critical';
        else if (val >= 25) label = 'Elevated';
        else if (val >= 15) label = 'Watch';
        return {
          key,
          name: 'Slope Incline Angle',
          value: val,
          unit: '°',
          icon: Triangle,
          max: 60,
          label,
          contribution: '+10%',
          description: 'Slope gradient. Steeper inclines double gravity shear stress, reducing overall mechanical safety factor.'
        };
      }
      case 'soilDepth': {
        const val = profile.soilDepth;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 3.0) label = 'Critical';
        else if (val >= 2.0) label = 'Elevated';
        else if (val >= 1.0) label = 'Watch';
        return {
          key,
          name: 'Colluvial Soil Depth',
          value: val,
          unit: 'm',
          icon: Layers,
          max: 5.0,
          label,
          contribution: '+6%',
          description: 'Depth of loose overburden soil resting over impermeable bedrock, indicating landslide block volume.'
        };
      }
      case 'elevation': {
        const val = profile.elevation;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 2200) label = 'Critical';
        else if (val >= 1200) label = 'Elevated';
        else if (val >= 500) label = 'Watch';
        return {
          key,
          name: 'Terrain Elevation',
          value: val,
          unit: 'm',
          icon: Compass,
          max: 4000,
          label,
          contribution: '+4%',
          description: 'Absolute height above sea level, mapping potential energy risk and local orographic precipitation.'
        };
      }
      case 'distanceToStream': {
        const val = profile.distanceToStream;
        let label: ParameterConfig['label'] = 'Normal';
        if (val < 100) label = 'Critical';
        else if (val < 200) label = 'Elevated';
        else if (val < 350) label = 'Watch';
        return {
          key,
          name: 'Distance to Stream',
          value: val,
          unit: 'm',
          icon: Waves,
          max: 600,
          label,
          contribution: '+3%',
          description: 'Proximity to active drainage channels. Lower values indicate active hydraulic toe erosion.'
        };
      }
      case 'drainageDensity': {
        const val = profile.drainageDensity;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 4.0) label = 'Critical';
        else if (val >= 3.0) label = 'Elevated';
        else if (val >= 2.0) label = 'Watch';
        return {
          key,
          name: 'Drainage Flow Density',
          value: val,
          unit: 'km/km²',
          icon: Spline,
          max: 6.0,
          label,
          contribution: '+3%',
          description: 'Density of channels per unit area, indicating structural surface water runoff capacities.'
        };
      }
      case 'historicalLandslides': {
        const val = profile.historicalLandslides;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 30) label = 'Critical';
        else if (val >= 15) label = 'Elevated';
        else if (val >= 5) label = 'Watch';
        return {
          key,
          name: 'Historical Slide Incidents',
          value: val,
          unit: ' events',
          icon: History,
          max: 60,
          label,
          contribution: '+7%',
          description: 'Number of past landslide incidents. High recurrence points to compromised geostructural safety.'
        };
      }
      case 'crackReports': {
        const val = profile.crackReports;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 9) label = 'Critical';
        else if (val >= 4) label = 'Elevated';
        else if (val >= 1) label = 'Watch';
        return {
          key,
          name: 'Tension Crack Reports',
          value: val,
          unit: ' locs',
          icon: AlertOctagon,
          max: 30,
          label,
          contribution: '+4%',
          description: 'Visual cracks reported in bedrock or asphalt. Represents direct active displacement.'
        };
      }
      case 'sensorVibration': {
        const val = profile.sensorVibration;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 5.0) label = 'Critical';
        else if (val >= 3.0) label = 'Elevated';
        else if (val >= 1.5) label = 'Watch';
        return {
          key,
          name: 'Geophone Sensor Vibration',
          value: val,
          unit: 'mm/s',
          icon: Activity,
          max: 10,
          label,
          contribution: '+3%',
          description: 'Micro-seismic velocity detected inside rock masses, reflecting initial crack shear strains.'
        };
      }
      case 'seismicityIndex': {
        const val = profile.seismicityIndex;
        let label: ParameterConfig['label'] = 'Normal';
        if (val >= 7.0) label = 'Critical';
        else if (val >= 5.0) label = 'Elevated';
        else if (val >= 3.0) label = 'Watch';
        return {
          key,
          name: 'Local Seismicity Index',
          value: val,
          unit: '/10',
          icon: GitCommit,
          max: 10,
          label,
          contribution: '+2%',
          description: 'Regional seismic baseline index. Minor tremors act as immediate shear stress triggers.'
        };
      }
      default:
        throw new Error(`Unknown parameter key ${key}`);
    }
  };

  const getStatusDotColor = (label: ParameterConfig['label']) => {
    switch (label) {
      case 'Critical': return 'bg-riskCritical';
      case 'Elevated': return 'bg-riskHigh';
      case 'Watch': return 'bg-riskModerate';
      default: return 'bg-riskVeryLow';
    }
  };

  const paramKeys = [
    'rainfallIntensity', 'rainfall24h', 'rainfall7d', 'rainfall72hForecast',
    'soilMoisture', 'slopeAngle', 'soilDepth', 'elevation',
    'distanceToStream', 'drainageDensity', 'historicalLandslides', 'crackReports',
    'sensorVibration', 'seismicityIndex'
  ];

  // Split parameters into two lists for parallel column rendering on desktop
  const leftKeys = paramKeys.slice(0, 7);
  const rightKeys = paramKeys.slice(7);

  const renderParameterRow = (key: string) => {
    const config = getParamConfig(key);
    const Icon = config.icon;
    const isExpanded = expandedKey === key;
    
    // Status text formatting
    let statusText = 'Normal';
    let statusColor = 'text-riskVeryLow';
    if (config.label === 'Critical') {
      statusText = 'Critical';
      statusColor = 'text-riskCritical';
    } else if (config.label === 'Elevated') {
      statusText = 'Elevated';
      statusColor = 'text-riskHigh';
    } else if (config.label === 'Watch') {
      statusText = 'Watch';
      statusColor = 'text-riskModerate';
    }

    return (
      <div 
        key={key} 
        className="border-b border-white/5 py-3 hover:bg-white/2 transition-colors duration-150 cursor-pointer"
        onClick={() => setExpandedKey(isExpanded ? null : key)}
      >
        <div className="flex items-center justify-between text-xs px-2.5">
          {/* Signal Label & Icon */}
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-tealAccent shrink-0" />
            <span className="font-semibold text-textWhite">{config.name}</span>
          </div>

          {/* Value, Status & Toggle */}
          <div className="flex items-center gap-6">
            <span className="font-mono font-bold text-textWhite">
              {config.value} <span className="text-[10px] text-textMuted font-sans font-medium">{config.unit}</span>
            </span>

            {/* Small status dot + text */}
            <div className="hidden sm:flex items-center gap-1.5 w-16">
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(config.label)}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>{statusText}</span>
            </div>

            <span className="text-[10px] font-mono text-textMuted w-8 text-right">{config.contribution}</span>

            <ChevronDown className={`w-3.5 h-3.5 text-textMuted transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180 text-tealAccent' : ''}`} />
          </div>
        </div>

        {/* Expandable diagnostic description */}
        {isExpanded && (
          <div className="mt-2.5 px-9 pb-1.5 text-[11px] text-textMuted leading-relaxed animate-fadeIn">
            <p className="border-l border-tealAccent/30 pl-3 py-0.5">{config.description}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div>
        <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
          Sensor Telemetry Array
        </span>
        <h3 className="text-base font-extrabold text-textWhite uppercase tracking-wide">
          Environmental Signals Matrix
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
        <div className="flex flex-col">
          {leftKeys.map(key => renderParameterRow(key))}
        </div>
        <div className="flex flex-col">
          {rightKeys.map(key => renderParameterRow(key))}
        </div>
      </div>
    </div>
  );
};

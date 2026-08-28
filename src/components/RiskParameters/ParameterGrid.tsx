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
  label: 'Safe' | 'Watch' | 'Elevated' | 'Critical';
  colorClass: string;
  contribution: string; 
  explanation: string;
}

export const ParameterGrid: React.FC<ParameterGridProps> = ({ profile }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

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
          key,
          name: 'Rainfall Intensity',
          value: val,
          unit: 'mm/hr',
          icon: CloudRain,
          max: 80,
          label,
          colorClass: getLabelColor(label),
          contribution: '18%',
          explanation: 'High intensity rainfall reduces slope safety factor by triggering sudden runoff and increasing pore water pressure.'
        };
      }
      case 'rainfall24h': {
        const val = profile.rainfall24h;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 150) label = 'Critical';
        else if (val >= 100) label = 'Elevated';
        else if (val >= 50) label = 'Watch';
        return {
          key,
          name: '24-Hour Rainfall',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 250,
          label,
          colorClass: getLabelColor(label),
          contribution: '22%',
          explanation: 'Excessive 24-hour precipitation saturates topsoil layers, initiating slope failure vectors.'
        };
      }
      case 'rainfall7d': {
        const val = profile.rainfall7d;
        let label: ParameterConfig['label'] = 'Safe';
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
          colorClass: getLabelColor(label),
          contribution: '16%',
          explanation: '7-day cumulative rainfall drives deep-seated slope hydration, decreasing shearing resistance along slip surfaces.'
        };
      }
      case 'rainfall72hForecast': {
        const val = profile.rainfall72hForecast;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 180) label = 'Critical';
        else if (val >= 120) label = 'Elevated';
        else if (val >= 60) label = 'Watch';
        return {
          key,
          name: '72H Rain Forecast',
          value: val,
          unit: 'mm',
          icon: CloudRain,
          max: 300,
          label,
          colorClass: getLabelColor(label),
          contribution: '14%',
          explanation: 'Predictive weather models flag imminent precipitation load, elevating diagnostic hazard forecasts.'
        };
      }
      case 'soilMoisture': {
        const val = profile.soilMoisture;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 80) label = 'Critical';
        else if (val >= 60) label = 'Elevated';
        else if (val >= 40) label = 'Watch';
        return {
          key,
          name: 'Soil Moisture',
          value: val,
          unit: '%',
          icon: Droplets,
          max: 100,
          label,
          colorClass: getLabelColor(label),
          contribution: '12%',
          explanation: 'Critical moisture levels reduce cohesive soil binding forces, accelerating gravitational displacement.'
        };
      }
      case 'slopeAngle': {
        const val = profile.slopeAngle;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 35) label = 'Critical';
        else if (val >= 25) label = 'Elevated';
        else if (val >= 15) label = 'Watch';
        return {
          key,
          name: 'Slope Angle',
          value: val,
          unit: '°',
          icon: Triangle,
          max: 60,
          label,
          colorClass: getLabelColor(label),
          contribution: '10%',
          explanation: 'Steep terrain angles experience higher tangential shear stress, reducing stability safety coefficients.'
        };
      }
      case 'soilDepth': {
        const val = profile.soilDepth;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 3.0) label = 'Critical';
        else if (val >= 2.0) label = 'Elevated';
        else if (val >= 1.0) label = 'Watch';
        return {
          key,
          name: 'Soil Depth',
          value: val,
          unit: 'm',
          icon: Layers,
          max: 5.0,
          label,
          colorClass: getLabelColor(label),
          contribution: '6%',
          explanation: 'Thick unconsolidated soil profiles represent larger slide masses when saturated with groundwater.'
        };
      }
      case 'elevation': {
        const val = profile.elevation;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 2200) label = 'Critical';
        else if (val >= 1200) label = 'Elevated';
        else if (val >= 500) label = 'Watch';
        return {
          key,
          name: 'Elevation',
          value: val,
          unit: 'm',
          icon: Compass,
          max: 4000,
          label,
          colorClass: getLabelColor(label),
          contribution: '4%',
          explanation: 'Higher altitudes correlate with severe climatic weathering, alpine freeze-thaw cycles, and slope exposure.'
        };
      }
      case 'distanceToStream': {
        const val = profile.distanceToStream;
        let label: ParameterConfig['label'] = 'Safe';
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
          colorClass: getLabelColor(label),
          contribution: '3%',
          explanation: 'Proximity to stream channels increases lateral erosion risk, undermining the slope toe structure.'
        };
      }
      case 'drainageDensity': {
        const val = profile.drainageDensity;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 4.0) label = 'Critical';
        else if (val >= 3.0) label = 'Elevated';
        else if (val >= 2.0) label = 'Watch';
        return {
          key,
          name: 'Drainage Density',
          value: val,
          unit: 'km/km²',
          icon: Spline,
          max: 6.0,
          label,
          colorClass: getLabelColor(label),
          contribution: '3%',
          explanation: 'High channel network density indicates fast surface runoff path creation and active soil washing.'
        };
      }
      case 'historicalLandslides': {
        const val = profile.historicalLandslides;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 30) label = 'Critical';
        else if (val >= 15) label = 'Elevated';
        else if (val >= 5) label = 'Watch';
        return {
          key,
          name: 'Historical Landslides',
          value: val,
          unit: ' events',
          icon: History,
          max: 60,
          label,
          colorClass: getLabelColor(label),
          contribution: '7%',
          explanation: 'Past occurrences indicate legacy geological fault lines, unstable slide scars, and repeat vulnerability.'
        };
      }
      case 'crackReports': {
        const val = profile.crackReports;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 9) label = 'Critical';
        else if (val >= 4) label = 'Elevated';
        else if (val >= 1) label = 'Watch';
        return {
          key,
          name: 'Slope Crack Reports',
          value: val,
          unit: ' locations',
          icon: AlertOctagon,
          max: 30,
          label,
          colorClass: getLabelColor(label),
          contribution: '4%',
          explanation: 'Surface tensile cracks indicate active slope creep and critical structural strain before collapse.'
        };
      }
      case 'sensorVibration': {
        const val = profile.sensorVibration;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 5.0) label = 'Critical';
        else if (val >= 3.0) label = 'Elevated';
        else if (val >= 1.5) label = 'Watch';
        return {
          key,
          name: 'Sensor Vibration',
          value: val,
          unit: 'mm/s',
          icon: Activity,
          max: 10,
          label,
          colorClass: getLabelColor(label),
          contribution: '3%',
          explanation: 'Sub-audible vibrations indicate micro-displacements and shearing friction along the rupture plane.'
        };
      }
      case 'seismicityIndex': {
        const val = profile.seismicityIndex;
        let label: ParameterConfig['label'] = 'Safe';
        if (val >= 7.0) label = 'Critical';
        else if (val >= 5.0) label = 'Elevated';
        else if (val >= 3.0) label = 'Watch';
        return {
          key,
          name: 'Seismicity Index',
          value: val,
          unit: '/10',
          icon: GitCommit,
          max: 10,
          label,
          colorClass: getLabelColor(label),
          contribution: '2%',
          explanation: 'Regional tectonic stress levels directly translate into peak ground acceleration and dynamic shear loading.'
        };
      }
      default:
        throw new Error(`Unknown parameter key ${key}`);
    }
  };

  const getLabelColor = (label: ParameterConfig['label']) => {
    switch (label) {
      case 'Critical': return 'bg-riskCritical/10 text-riskVeryHigh border-riskCritical/20';
      case 'Elevated': return 'bg-riskHigh/10 text-riskHigh border-riskHigh/20';
      case 'Watch': return 'bg-riskModerate/10 text-riskModerate border-riskModerate/20';
      default: return 'bg-riskVeryLow/10 text-riskVeryLow border-riskVeryLow/20';
    }
  };

  const paramKeys = [
    'rainfallIntensity', 'rainfall24h', 'rainfall7d', 'rainfall72hForecast',
    'soilMoisture', 'slopeAngle', 'soilDepth', 'elevation',
    'distanceToStream', 'drainageDensity', 'historicalLandslides', 'crackReports',
    'sensorVibration', 'seismicityIndex'
  ];

  const toggleRow = (key: string) => {
    setExpandedKey(prev => (prev === key ? null : key));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <span className="text-[9px] text-[#8FA6B8] uppercase font-bold tracking-widest block mb-0.5">
          Telemetry & Terrain Parameter Matrix
        </span>
        <h3 className="text-base font-extrabold tracking-wide text-textWhite uppercase">
          Sensor Readings & Influence Weights
        </h3>
      </div>

      {/* Unified List Grid Container */}
      <div className="glass-panel overflow-hidden border border-white/8">
        
        {/* Table Header Row */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-2.5 bg-white/2 border-b border-white/5 text-[9px] text-textMuted uppercase font-bold tracking-wider">
          <div className="col-span-4">Sensor Parameter</div>
          <div className="col-span-2 text-right">Telemetry Value</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-center">Sensor Saturation</div>
          <div className="col-span-1 text-right">Weight</div>
        </div>

        {/* Row Entries */}
        <div className="divide-y divide-white/5">
          {paramKeys.map(key => {
            const config = getParamConfig(key);
            const Icon = config.icon;
            const isExpanded = expandedKey === key;
            
            let progressPercent = Math.min(100, (config.value / config.max) * 100);
            if (key === 'distanceToStream') {
              progressPercent = Math.max(0, 100 - (config.value / config.max) * 100);
            }

            return (
              <div 
                key={key} 
                className={`transition-colors duration-150 ${isExpanded ? 'bg-white/3' : 'hover:bg-white/1'}`}
              >
                {/* Main Interactive Row */}
                <div 
                  onClick={() => toggleRow(key)}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-3.5 items-center cursor-pointer text-xs select-none"
                >
                  {/* Parameter Name & Icon */}
                  <div className="col-span-4 flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-white/5 border border-white/8 text-tealAccent shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-textWhite">{config.name}</span>
                  </div>

                  {/* Value readout */}
                  <div className="col-span-2 text-left sm:text-right flex sm:block items-baseline gap-1">
                    <span className="sm:hidden text-[9px] text-textMuted uppercase font-bold mr-1.5">Value:</span>
                    <span className="font-bold font-mono text-textWhite">{config.value}</span>
                    <span className="text-[10px] text-textMuted ml-0.5">{config.unit}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-2 text-left sm:text-center flex sm:block items-center">
                    <span className="sm:hidden text-[9px] text-textMuted uppercase font-bold mr-3">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${config.colorClass}`}>
                      {config.label}
                    </span>
                  </div>

                  {/* Micro Progress saturation bar */}
                  <div className="col-span-3 flex items-center gap-2.5">
                    <span className="sm:hidden text-[9px] text-textMuted uppercase font-bold mr-2">Saturation:</span>
                    <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
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
                  </div>

                  {/* Weight factor percentage */}
                  <div className="col-span-1 text-left sm:text-right flex sm:block items-center justify-between">
                    <div className="flex items-center gap-1 sm:justify-end w-full sm:w-auto">
                      <span className="sm:hidden text-[9px] text-textMuted uppercase font-bold">Influence:</span>
                      <span className="font-bold font-mono text-[#8FA6B8]">{config.contribution}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-textMuted ml-1.5 transition-transform duration-250 ${isExpanded ? 'rotate-180 text-tealAccent' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Expanded geological diagnostic explanation */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-1 text-[11px] text-textMuted leading-relaxed bg-white/1 border-t border-white/2">
                    <div className="pl-8 flex items-start gap-2 text-tealAccent">
                      <span className="font-bold uppercase tracking-wider text-[9px] mt-0.5">Diagnostic:</span>
                      <p className="flex-1 text-[#8FA6B8]">{config.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

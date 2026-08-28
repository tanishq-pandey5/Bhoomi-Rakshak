import React from 'react';
import type { StateRiskProfile } from '../../data/mockData';
import { 
  CloudRain, 
  Droplets, 
  Compass, 
  Activity, 
  AlertOctagon 
} from 'lucide-react';

interface ParameterGridProps {
  profile: StateRiskProfile;
}

export const ParameterGrid: React.FC<ParameterGridProps> = ({ profile }) => {
  const getSeverityColorClass = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'text-[#FF4D5A]';
      case 'HIGH': return 'text-[#FF8A3D]';
      case 'ELEVATED': return 'text-[#F5C451]';
      case 'WATCH': return 'text-[#55C7FF]';
      default: return 'text-[#32D583]';
    }
  };

  const signals = [
    {
      label: 'Rainfall Intensity',
      value: `${profile.rainfallIntensity} mm/hr`,
      status: profile.rainfallIntensity >= 45 ? 'HIGH' : profile.rainfallIntensity >= 25 ? 'ELEVATED' : 'WATCH',
      icon: CloudRain
    },
    {
      label: '24-Hour Rainfall',
      value: `${profile.rainfall24h} mm`,
      status: profile.rainfall24h >= 150 ? 'CRITICAL' : profile.rainfall24h >= 100 ? 'HIGH' : 'ELEVATED',
      icon: CloudRain
    },
    {
      label: 'Soil Moisture',
      value: `${profile.soilMoisture}%`,
      status: profile.soilMoisture >= 80 ? 'CRITICAL' : profile.soilMoisture >= 60 ? 'HIGH' : 'ELEVATED',
      icon: Droplets
    },
    {
      label: 'Slope Angle',
      value: `${profile.slopeAngle}°`,
      status: profile.slopeAngle >= 35 ? 'ELEVATED' : profile.slopeAngle >= 25 ? 'WATCH' : 'SAFE',
      icon: Compass
    },
    {
      label: 'Sensor Vibration',
      value: `${profile.sensorVibration} mm/s`,
      status: profile.sensorVibration >= 5.0 ? 'CRITICAL' : profile.sensorVibration >= 2.0 ? 'HIGH' : 'WATCH',
      icon: Activity
    },
    {
      label: 'Seismicity',
      value: profile.seismicityIndex >= 6.0 ? 'High' : profile.seismicityIndex >= 3.0 ? 'Moderate' : 'Low',
      status: profile.seismicityIndex >= 6.0 ? 'HIGH' : profile.seismicityIndex >= 3.0 ? 'WATCH' : 'SAFE',
      icon: AlertOctagon
    }
  ];

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
        Environmental Signals
      </span>
      <div className="grid grid-cols-2 gap-3.5">
        {signals.map((sig, idx) => {
          const Icon = sig.icon;
          const color = getSeverityColorClass(sig.status);
          return (
            <div key={idx} className="p-4 rounded-lg bg-[#06152B]/45 border border-[#29A9FF]/8 flex flex-col justify-between h-24">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#A7B6CC] font-bold uppercase tracking-wider block leading-none">
                  {sig.label}
                </span>
                <Icon className="w-3.5 h-3.5 text-[#55C7FF]" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#F5F7FA] font-mono block leading-none">
                  {sig.value}
                </span>
                <span className={`text-[8px] font-extrabold uppercase tracking-widest block mt-2 leading-none ${color}`}>
                  {sig.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

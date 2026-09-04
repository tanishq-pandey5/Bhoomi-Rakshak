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
    <div className="flex flex-col gap-6 w-full">
      
      {/* Editorial Header */}
      <div>
        <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
          Telemetry Readings
        </span>
        <h3 className="text-xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
          Environmental Signals
        </h3>
      </div>

      {/* 2x3 Grid with generous spacing and height */}
      <div className="grid grid-cols-2 gap-5">
        {signals.map((sig, idx) => {
          const Icon = sig.icon;
          const color = getSeverityColorClass(sig.status);
          return (
            <div 
              key={idx} 
              className="p-6 rounded-2xl bg-[#081830]/40 border border-white/5 flex flex-col justify-between h-[135px] hover:border-white/10 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#A7B6CC] font-bold uppercase tracking-wider block leading-none">
                  {sig.label}
                </span>
                <Icon className="w-4 h-4 text-[#29A9FF]" />
              </div>
              <div>
                {/* Large dominant value */}
                <span className="text-3xl font-extrabold text-[#F5F7FB] font-mono block leading-none">
                  {sig.value}
                </span>
                <span className={`text-[9px] font-extrabold uppercase tracking-widest block mt-3.5 leading-none ${color}`}>
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

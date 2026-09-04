import React from 'react';
import { Database, LineChart, Cpu, BellRing } from 'lucide-react';

export const Methodology: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Collect',
      desc: 'Rainfall, soil, terrain, seismic, and sensor data',
      icon: Database,
      color: 'text-[#29A9FF] bg-[#29A9FF]/10'
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Feature engineering and risk parameter analysis',
      icon: LineChart,
      color: 'text-[#55C7FF] bg-[#55C7FF]/10'
    },
    {
      num: '03',
      title: 'Predict',
      desc: 'Machine-learning model estimates landslide probability',
      icon: Cpu,
      color: 'text-[#6D5CE7] bg-[#6D5CE7]/10'
    },
    {
      num: '04',
      title: 'Alert',
      desc: 'Authorities and communities receive risk-based warnings',
      icon: BellRing,
      color: 'text-[#FF4D5A] bg-[#FF4D5A]/10'
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full select-none mt-4">
      
      {/* Title */}
      <div>
        <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
          Operational Pipeline
        </span>
        <h3 className="text-2xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
          How Bhoomi Rakshak Sees the Risk
        </h3>
        <p className="text-xs text-[#A7B6CC] mt-0.5 max-w-2xl leading-relaxed">
          Bhoomi Rakshak combines environmental, geological, historical, and sensor data to forecast landslide probability.
        </p>
      </div>

      {/* Horizontal Steps with Connecting Line */}
      <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-12 items-start justify-between w-full mt-2">
        {/* Horizontal connecting line on desktop */}
        <div className="hidden lg:block absolute left-4 right-4 top-10 h-px bg-white/5 z-0" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex-1 flex gap-4 p-5 rounded-2xl bg-[#081830]/40 border border-white/5 relative z-10 w-full hover:border-white/10 transition-colors duration-300">
              
              {/* Step number and icon */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-2xl font-black text-[#71839C] tracking-tighter leading-none">
                  {step.num}
                </span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${step.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Step Info */}
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-[#F5F7FB] uppercase tracking-wider mt-0.5">{step.title}</h4>
                <p className="text-xs text-[#A7B6CC] leading-relaxed">
                  {step.desc}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

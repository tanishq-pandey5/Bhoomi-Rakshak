import React from 'react';
import { Database, LineChart, Cpu, BellRing } from 'lucide-react';

export const Methodology: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Collect',
      desc: 'Rainfall, soil, terrain, seismic, and sensor data',
      icon: Database,
      color: 'text-tealAccent bg-tealAccent/10 border-tealAccent/20'
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Feature engineering and risk parameter analysis',
      icon: LineChart,
      color: 'text-saffronAccent bg-saffronAccent/10 border-saffronAccent/20'
    },
    {
      num: '03',
      title: 'Predict',
      desc: 'Machine-learning model estimates landslide probability',
      icon: Cpu,
      color: 'text-tealAccent bg-tealAccent/10 border-tealAccent/20'
    },
    {
      num: '04',
      title: 'Alert',
      desc: 'Authorities and communities receive risk-based warnings',
      icon: BellRing,
      color: 'text-riskVeryHigh bg-riskVeryHigh/10 border-riskVeryHigh/20'
    }
  ];

  return (
    <div className="glass-panel p-5 flex flex-col lg:flex-row gap-6 lg:items-center justify-between border border-white/12">
      
      {/* Left: Heading block */}
      <div className="max-w-xs shrink-0 flex flex-col gap-1">
        <h3 className="text-base font-black text-textWhite tracking-tight uppercase">
          How Bhoomi Rakshak Works
        </h3>
        <p className="text-[11px] text-textMuted leading-relaxed">
          Bhoomi Rakshak combines environmental, geological, historical, and sensor data to forecast landslide probability for the next 72 hours.
        </p>
      </div>

      {/* Right: Timeline Flex Row */}
      <div className="flex-1 flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-4 items-stretch">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex-1 min-w-[200px] flex gap-3 p-3.5 rounded-xl border border-white/8 bg-white/3 relative overflow-hidden">
              
              {/* Icon */}
              <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center border ${step.color} mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Title & Desc */}
              <div className="flex flex-col gap-0.5 z-10">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-textMuted font-bold">{step.num}</span>
                  <h4 className="text-xs font-black text-textWhite uppercase">{step.title}</h4>
                </div>
                <p className="text-[10px] text-textMuted leading-normal">
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

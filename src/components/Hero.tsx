import React from 'react';
import { ShieldAlert, Calendar, RefreshCw, BarChart2 } from 'lucide-react';

interface HeroProps {
  onExploreMap: () => void;
  onViewAlerts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMap, onViewAlerts }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-4">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-tealAccent/5 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-saffronAccent/5 blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Description content */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tealAccent/15 border border-tealAccent/30 text-xs font-semibold text-tealAccent uppercase tracking-wider mb-4 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            AI-Powered Early Warning Platform
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-textWhite leading-tight">
            India Landslide Risk <span className="bg-gradient-to-r from-tealAccent to-tealAccent/60 bg-clip-text text-transparent">Intelligence</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-textMuted leading-relaxed">
            Monitor precipitation depth, slope topography, geological strata, soil moisture, and localized telemetry sensors to identify landslide hazards up to <strong className="text-textWhite font-semibold">72 hours</strong> in advance.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onExploreMap}
              className="px-6 py-2.5 rounded-full bg-tealAccent hover:bg-tealAccent/90 text-bgDark font-bold text-sm shadow-lg shadow-tealAccent/15 hover:shadow-tealAccent/30 transition-all duration-200"
            >
              Explore Risk Map
            </button>
            <button
              onClick={onViewAlerts}
              className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-textWhite font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              View Active Alerts
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 p-6 glass-panel">
          {[
            { label: 'States Monitored', value: '36', detail: 'All India & UTs', icon: BarChart2, color: 'text-tealAccent' },
            { label: 'High-Risk Regions', value: '8', detail: 'North-East Focus', icon: ShieldAlert, color: 'text-saffronAccent' },
            { label: 'Forecast Window', value: '72 Hours', detail: 'AI Predictive Horizon', icon: Calendar, color: 'text-tealAccent' },
            { label: 'Telemetry Sync', value: 'Every 3h', detail: 'Satellite & Sensor Feed', icon: RefreshCw, color: 'text-textWhite' }
          ].map((stat, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 mt-0.5">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <span className="text-[10px] text-textMuted uppercase font-semibold tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-xl sm:text-2xl font-black text-textWhite block mt-0.5 font-mono">
                  {stat.value}
                </span>
                <span className="text-[10px] text-textMuted block mt-0.5">
                  {stat.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

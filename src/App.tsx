import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StateSelector } from './components/StateSelector';
import { IndiaMap } from './components/Map/IndiaMap';
import { StateDetailsPanel } from './components/Details/StateDetailsPanel';
import { ParameterGrid } from './components/RiskParameters/ParameterGrid';
import { RiskForecastChart, RainfallForecastChart } from './components/Charts/ChartsGrid';
import { AlertsList } from './components/Alerts/AlertsList';
import { DistrictTable } from './components/Districts/DistrictTable';
import { Methodology } from './components/Methodology';
import { Footer } from './components/Footer';
import { getFullStateProfile, getRiskColor } from './data/mockData';
import { 
  ShieldAlert, 
  Activity
} from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success';
}

const App: React.FC = () => {
  // Set initial selected state to Assam to match visual reference image
  const [selectedState, setSelectedState] = useState<string>('Assam');
  const [regionFilter, setRegionFilter] = useState<string>('All India');
  const [zoomState, setZoomState] = useState<'globe' | 'india' | 'northeast'>('india');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Trigger toast when selected state changes
  const stateProfile = useMemo(() => {
    return getFullStateProfile(selectedState);
  }, [selectedState]);

  useEffect(() => {
    addToast(
      `Selected: ${stateProfile.name} — Risk Index: ${stateProfile.riskPercentage}% (${stateProfile.riskLevel})`,
      'success'
    );
  }, [selectedState]);

  const addToast = (message: string, type: 'info' | 'success' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSelectState = (stateName: string) => {
    setSelectedState(stateName);
    if (zoomState === 'globe') {
      setZoomState('india');
    }
  };

  const handleSelectRegion = (regionName: string) => {
    setRegionFilter(regionName);
    addToast(`Region filter: ${regionName}`, 'info');
    
    if (regionName === 'North-East India') {
      setZoomState('northeast');
      setSelectedState('Assam'); 
    } else {
      setZoomState('india');
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bgDark flex flex-col font-sans antialiased text-[#F5F7FB] relative overflow-x-hidden">
      
      {/* Sticky transparent Navbar */}
      <Navbar 
        onScrollTo={handleScrollTo} 
        lastUpdated={stateProfile.lastUpdated} 
      />

      {/* Main Page Content Centered - max-width: 1440px, px-16 spacing */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-16 flex flex-col">
        
        {/* Section 1: Hero Header Area (Spacious vertical padding) */}
        <section className="py-28 relative flex flex-col md:flex-row items-center justify-between gap-12 w-full">
          <div className="flex flex-col gap-6 max-w-2xl relative z-10">
            <span className="text-[12px] font-bold text-[#29A9FF] uppercase tracking-widest leading-none">
              AI-Powered Early Warning System
            </span>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-[#F5F7FB] leading-[1.05] uppercase">
              India Landslide <br />
              <span className="font-medium text-[#29A9FF]">Risk Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-[#A7B6CC] leading-relaxed font-normal max-w-xl">
              Monitor rainfall, terrain, soil, seismic, historical and sensor indicators to identify landslide risk up to 72 hours in advance.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#32D583] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#32D583] pulse-green-dot"></span>
              </span>
              <span className="text-xs text-[#32D583] font-bold uppercase tracking-wider">System Operational</span>
            </div>
          </div>

          {/* Right silhouette mountain vector decoration */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-1/2 h-full hidden md:block select-none">
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 300 L180 140 L280 230 L380 90 L450 300 Z" fill="url(#heroMountainGrad)" />
              <defs>
                <linearGradient id="heroMountainGrad" x1="200" y1="90" x2="200" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#29A9FF" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>

        {/* Section 2: Horizontal Metrics Strip */}
        <section className="py-10 border-y border-white/5 w-full flex items-center justify-between gap-6 overflow-x-auto select-none">
          {[
            { value: '36', label: 'States Monitored' },
            { value: '8', label: 'High-Risk States' },
            { value: '72h', label: 'Forecast Window' },
            { value: '3h', label: 'Data Refresh' }
          ].map((metric, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col text-center flex-1 min-w-[120px]">
                <span className="text-4xl font-extrabold text-[#F5F7FB] font-mono leading-none tracking-tight">
                  {metric.value}
                </span>
                <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest mt-3.5 leading-none">
                  {metric.label}
                </span>
              </div>
              {idx < 3 && <div className="h-8 w-px bg-white/5 shrink-0" />}
            </React.Fragment>
          ))}
        </section>

        {/* Section 3: Risk Map Experience (Map on left 60%, intelligence panels on right 40%) */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start w-full">
          {/* Map Left (60%) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <IndiaMap 
              selectedState={selectedState}
              onSelectState={handleSelectState}
              regionFilter={regionFilter}
              zoomState={zoomState}
              setZoomState={setZoomState}
              onExploreMap={() => {}}
              onViewAlerts={() => {}}
            />
          </div>

          {/* Intelligence Panel Right (40%) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <StateSelector 
              selectedState={selectedState}
              onSelectState={handleSelectState}
              regionFilter={regionFilter}
              onSelectRegion={handleSelectRegion}
            />

            <StateDetailsPanel profile={stateProfile} />
            
            {/* Drivers card details */}
            <div className="glass-panel p-10 flex flex-col gap-6 border border-white/5 bg-[#081830]/40">
              <div>
                <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
                  Threat Composition
                </span>
                <h4 className="text-xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
                  Primary Risk Drivers
                </h4>
                <div className="flex flex-col gap-4 mt-6">
                  {[
                    { label: 'Rainfall', value: '31%', width: '31%', color: 'bg-[#29A9FF]' },
                    { label: 'Soil Moisture', value: '22%', width: '22%', color: 'bg-[#32D583]' },
                    { label: 'Slope Angle', value: '17%', width: '17%', color: 'bg-[#F5C451]' },
                    { label: 'Historical Landslides', value: '10%', width: '10%', color: 'bg-[#FF8A3D]' }
                  ].map((drv, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold text-[#F5F7FB] leading-none">
                        <span>{drv.label}</span>
                        <span className="font-mono text-[#A7B6CC]">{drv.value}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full ${drv.color}`} style={{ width: drv.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {stateProfile.riskPercentage >= 70 && (
                <div className="p-5 rounded-2xl border border-[#FF4D5A]/20 bg-[#FF4D5A]/5 text-xs text-[#F5F7FB] leading-relaxed flex gap-3.5 mt-2">
                  <ShieldAlert className="w-5 h-5 text-[#FF4D5A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#FF4D5A] block uppercase tracking-wider text-[9px] mb-1">
                      High Landslide Risk Expected
                    </strong>
                    Increase monitoring of vulnerable slopes and prepare local response teams immediately.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Environmental Signals */}
        <section className="py-24 border-t border-white/5 w-full">
          <ParameterGrid profile={stateProfile} />
        </section>

        {/* Section 5: 72-Hour Risk Forecast */}
        <section className="py-24 border-t border-white/5 w-full">
          <RiskForecastChart profile={stateProfile} />
        </section>

        {/* Section 6: Rainfall Forecast (72 Hours) */}
        <section className="py-24 border-t border-white/5 w-full">
          <RainfallForecastChart profile={stateProfile} />
        </section>

        {/* Section 7: Live Alerts timeline */}
        <section id="alerts" className="py-24 border-t border-white/5 w-full scroll-mt-20">
          <AlertsList onSelectState={handleSelectState} />
        </section>

        {/* Section 8: Most Vulnerable Districts Table */}
        <section className="py-24 border-t border-white/5 w-full">
          <DistrictTable selectedState={selectedState} onSelectState={handleSelectState} />
        </section>

        {/* Section 9: North-East Watch (Constellation strip) */}
        <section id="risk-map" className="py-28 border-t border-white/5 w-full scroll-mt-20">
          <div className="relative flex flex-col gap-6 overflow-hidden w-full select-none">
            
            {/* Mountain silhouettes behind section */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-end">
              <svg className="w-full h-40" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,200 L 100,50 L 250,150 L 400,20 L 600,160 L 750,80 L 800,200 Z" fill="#55C7FF" />
              </svg>
            </div>

            <div className="z-10">
              <span className="text-[10px] text-[#FF8A3D] uppercase font-bold tracking-widest block">
                Regional Watch Network
              </span>
              <h3 className="text-3xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
                The North-East Under Watch
              </h3>
              <p className="text-sm text-[#A7B6CC] mt-2 max-w-2xl leading-relaxed">
                Mountainous terrain, intense rainfall and complex geological conditions make the region especially sensitive to slope instability.
              </p>
            </div>

            {/* Constellation states horizontal nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5 mt-4 z-10">
              {["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"].map((stName, idx) => {
                const profile = getFullStateProfile(stName);
                const color = getRiskColor(profile.riskLevel);
                const isSel = selectedState === stName;
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectState(stName)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 ${
                      isSel 
                        ? 'border-[#29A9FF] bg-[#29A9FF]/10 shadow-lg shadow-[#29A9FF]/5' 
                        : 'border-white/5 bg-[#081830]/40 hover:border-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#F5F7FB] truncate uppercase block leading-none">{stName}</span>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-black font-mono text-[#F5F7FB] leading-none">{profile.riskPercentage}%</span>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Section 10: Methodology Operational journey */}
        <section id="methodology" className="py-24 border-t border-white/5 w-full scroll-mt-20">
          <Methodology />
        </section>

      </main>

      {/* Full width project footer */}
      <Footer onScrollTo={handleScrollTo} />

      {/* Floating active warning toasts container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`p-4 rounded-lg shadow-2xl flex items-center gap-3 border pointer-events-auto animate-slideUp text-xs font-semibold ${
              toast.type === 'success' 
                ? 'bg-[#32D583]/10 border-[#32D583]/30 text-[#32D583]' 
                : 'bg-[#29A9FF]/10 border-[#29A9FF]/30 text-[#29A9FF]'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default App;

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StateSelector } from './components/StateSelector';
import { IndiaMap } from './components/Map/IndiaMap';
import { StateDetailsPanel } from './components/Details/StateDetailsPanel';
import { ParameterGrid } from './components/RiskParameters/ParameterGrid';
import { ChartsGrid } from './components/Charts/ChartsGrid';
import { AlertsList } from './components/Alerts/AlertsList';
import { DistrictTable } from './components/Districts/DistrictTable';
import { Methodology } from './components/Methodology';
import { Footer } from './components/Footer';
import { getFullStateProfile, getRiskColor } from './data/mockData';
import { 
  ShieldAlert, 
  Calendar, 
  RefreshCw, 
  BarChart2, 
  X,
  Activity,
  User,
  Clock
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
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Trigger toast when selected state changes
  const stateProfile = useMemo(() => {
    return getFullStateProfile(selectedState);
  }, [selectedState]);

  useEffect(() => {
    addToast(
      `Selected: ${stateProfile.name} — ML Risk Index: ${stateProfile.riskPercentage}% (${stateProfile.riskLevel})`,
      'success'
    );
  }, [selectedState]);

  const addToast = (message: string, type: 'info' | 'success' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSelectState = (stateName: string) => {
    setSelectedState(stateName);
    if (zoomState === 'globe') {
      setZoomState('india');
    }
  };

  const handleSelectRegion = (regionName: string) => {
    setRegionFilter(regionName);
    addToast(`Region filter updated to: ${regionName}`, 'info');
    
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
      addToast(`Navigating to ${id.replace('-', ' ')}`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-bgDark flex flex-col font-sans antialiased text-textWhite relative">
      
      {/* Sticky Top transparent Navbar */}
      <Navbar 
        onScrollTo={handleScrollTo} 
        lastUpdated={stateProfile.lastUpdated} 
      />

      {/* Main Column Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6 flex flex-col gap-6">
        
        {/* Row 1: Left Header Hero Title & Right Metrics Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Title block */}
          <div className="lg:col-span-7 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#29A9FF]/10 border border-[#29A9FF]/20 text-[9px] font-bold text-[#29A9FF] uppercase tracking-widest w-fit">
              AI-Powered Early Warning System
            </span>
            <h1 className="text-3xl font-extrabold text-[#F5F7FA] leading-none tracking-tight uppercase">
              India Landslide Risk Intelligence
            </h1>
            <p className="text-xs text-[#A7B6CC] leading-normal max-w-xl">
              Monitor rainfall, terrain, soil, seismic, historical and sensor indicators to identify landslide risk up to 72 hours in advance.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#32D583] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#32D583] pulse-green-dot"></span>
              </span>
              <span className="text-[10px] text-[#32D583] font-bold uppercase tracking-wider">System Operational</span>
            </div>
          </div>

          {/* Right Metrics panel */}
          <div className="lg:col-span-5 flex items-center justify-between py-4 px-6 glass-panel border border-[#29A9FF]/8 bg-[#06152B]/40 h-20">
            {[
              { label: 'States Monitored', value: '36' },
              { label: 'High-Risk States', value: '8' },
              { label: 'Forecast Window', value: '72h' },
              { label: 'Data Refresh', value: '3h' }
            ].map((m, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col text-center flex-1">
                  <span className="text-2xl font-black text-[#F5F7FA] font-mono leading-none">
                    {m.value}
                  </span>
                  <span className="text-[9px] text-[#71839C] uppercase font-bold tracking-wider mt-1.5 leading-none">
                    {m.label}
                  </span>
                </div>
                {idx < 3 && <div className="h-10 w-px bg-white/5" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Row 2: 12-Column Dashboard Workspace grid */}
        <div id="dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column workspace (Map and Charts) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            
            {/* Interactive India Map */}
            <div className="h-full">
              <IndiaMap 
                selectedState={selectedState}
                onSelectState={handleSelectState}
                regionFilter={regionFilter}
                zoomState={zoomState}
                setZoomState={setZoomState}
                onExploreMap={() => handleScrollTo('risk-map')}
                onViewAlerts={() => handleScrollTo('alerts')}
              />
            </div>

            {/* Recharts Analytics side-by-side */}
            <div>
              <ChartsGrid profile={stateProfile} />
            </div>

            {/* Districts vulnerability table */}
            <div>
              <DistrictTable 
                selectedState={selectedState} 
                onSelectState={handleSelectState} 
              />
            </div>

          </div>

          {/* Right Column workspace (Diagnostics, telemetry and feeds) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            
            {/* Region Search Selector dropdown */}
            <StateSelector 
              selectedState={selectedState}
              onSelectState={handleSelectState}
              regionFilter={regionFilter}
              onSelectRegion={handleSelectRegion}
            />

            {/* Active Region circular arc gauge */}
            <div>
              <StateDetailsPanel profile={stateProfile} />
            </div>

            {/* Drivers and Environmental Signals side-by-side grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Left half: Drivers list and warning box */}
              <div className="flex flex-col gap-4">
                <div className="glass-panel p-5 flex flex-col gap-3.5 border border-[#29A9FF]/8 h-full justify-between">
                  <div>
                    <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
                      Primary Risk Drivers
                    </span>
                    <div className="flex flex-col gap-3 mt-3">
                      {[
                        { label: 'Rainfall', value: '31%', width: '31%', color: 'bg-[#29A9FF]' },
                        { label: 'Soil Moisture', value: '22%', width: '22%', color: 'bg-[#32D583]' },
                        { label: 'Slope Angle', value: '17%', width: '17%', color: 'bg-[#F5C451]' },
                        { label: 'Historical Landslides', value: '10%', width: '10%', color: 'bg-[#FF8A3D]' }
                      ].map((drv, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-semibold text-[#F5F7FA] leading-none">
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

                  {/* Warning box */}
                  {stateProfile.riskPercentage >= 70 && (
                    <div className="p-3.5 rounded-lg border border-[#FF4D5A]/20 bg-[#FF4D5A]/5 text-[10px] text-[#F5F7FA] leading-relaxed flex gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#FF4D5A] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#FF4D5A] block uppercase tracking-wider text-[8px] mb-0.5">
                          High Landslide Risk Expected
                        </strong>
                        Increase monitoring of vulnerable slopes and prepare response teams.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right half: Environmental grids */}
              <div>
                <ParameterGrid profile={stateProfile} />
              </div>

            </div>

            {/* Live alerts warnings stream */}
            <div id="alerts" className="scroll-mt-20">
              <AlertsList onSelectState={handleSelectState} />
            </div>

          </div>

        </div>

        {/* Row 3: Dedicated North-East active watch strip */}
        <div id="risk-map" className="scroll-mt-20">
          <div className="glass-panel p-6 border border-[#29A9FF]/8 flex flex-col gap-4 relative overflow-hidden bg-[#06152B]/20">
            
            {/* Visual contour backdrop */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,100 Q 300,150 600,50 T 1200,100" stroke="#29A9FF" strokeWidth="1" fill="none" />
                <path d="M 0,140 Q 400,80 800,160 T 1200,120" stroke="#29A9FF" strokeWidth="1" fill="none" />
              </svg>
            </div>

            <div className="z-10">
              <span className="text-[10px] text-[#FF8A3D] uppercase font-bold tracking-widest block mb-0.5">
                Regional Watch Network
              </span>
              <h3 className="text-base font-extrabold tracking-wide text-[#F5F7FA] uppercase">
                The North-East Under Watch
              </h3>
              <p className="text-xs text-[#A7B6CC] mt-1 max-w-2xl leading-relaxed">
                Mountainous terrain, intense rainfall and complex geological conditions make the region especially sensitive to slope instability.
              </p>
            </div>

            {/* Constellation states grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-2 z-10">
              {["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"].map((stName, idx) => {
                const profile = getFullStateProfile(stName);
                const color = getRiskColor(profile.riskLevel);
                const isSel = selectedState === stName;
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectState(stName)}
                    className={`p-3.5 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between h-20 ${
                      isSel 
                        ? 'border-[#29A9FF] bg-[#29A9FF]/10 shadow-lg shadow-[#29A9FF]/5' 
                        : 'border-white/5 bg-[#06152B]/40 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#F5F7FA] truncate uppercase block">{stName}</span>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-xs font-black font-mono text-[#F5F7FA]">{profile.riskPercentage}%</span>
                      <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Row 4: Methodology system works */}
        <div id="methodology" className="scroll-mt-20">
          <Methodology />
        </div>

      </main>

      {/* Full width project footer */}
      <Footer onScrollTo={handleScrollTo} />

      {/* Floating active toasts container */}
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

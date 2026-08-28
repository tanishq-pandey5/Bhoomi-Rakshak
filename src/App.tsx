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
import { getFullStateProfile } from './data/mockData';
import { 
  LayoutDashboard, 
  Map, 
  Bell, 
  Cpu, 
  Info, 
  ShieldAlert, 
  Calendar, 
  RefreshCw, 
  BarChart2, 
  ShieldCheck,
  X,
  Activity
} from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success';
}

const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('Meghalaya');
  const [regionFilter, setRegionFilter] = useState<string>('All India');
  const [zoomState, setZoomState] = useState<'globe' | 'india' | 'northeast'>('globe');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showHero, setShowHero] = useState<boolean>(true);

  // ML model prediction state
  const [mlPrediction, setMlPrediction] = useState<{
    riskPercentage: number;
    riskLevel: string;
  } | null>(null);

  // Call the local Python prediction server on state change
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const profile = getFullStateProfile(selectedState);
        const res = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success') {
            setMlPrediction({
              riskPercentage: data.predicted_risk_percentage,
              riskLevel: data.predicted_risk_level
            });
          }
        }
      } catch (e) {
        // Fallback silently if Python server is not active
        setMlPrediction(null);
      }
    };
    
    fetchPrediction();
  }, [selectedState]);

  // Merge ML prediction values into stateProfile
  const stateProfile = useMemo(() => {
    const baseProfile = getFullStateProfile(selectedState);
    if (mlPrediction) {
      const level = mlPrediction.riskLevel;
      let alert = "Low current risk. Continue routine monitoring.";
      if (level === 'Critical') alert = "Critical landslide conditions detected. Immediate monitoring and local authority response recommended.";
      else if (level === 'Very High') alert = "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.";
      else if (level === 'High') alert = "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.";
      else if (level === 'Moderate') alert = "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.";

      return {
        ...baseProfile,
        riskPercentage: mlPrediction.riskPercentage,
        riskLevel: level as any,
        alertMessage: alert
      };
    }
    return baseProfile;
  }, [selectedState, mlPrediction]);

  // Trigger toast when selected state changes
  useEffect(() => {
    if (selectedState) {
      addToast(
        `Selected: ${stateProfile.name} — ML Risk Index: ${stateProfile.riskPercentage}% (${stateProfile.riskLevel})`,
        'success'
      );
    }
  }, [selectedState, stateProfile.riskPercentage, stateProfile.riskLevel]);

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
      setSelectedState('Meghalaya'); 
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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'dashboard') handleScrollTo('dashboard');
    else if (tabId === 'risk-map') handleScrollTo('risk-map');
    else if (tabId === 'alerts') handleScrollTo('alerts');
    else if (tabId === 'methodology') handleScrollTo('methodology');
    else if (tabId === 'footer') handleScrollTo('footer');
  };

  return (
    <div className="min-h-screen bg-bgDark flex flex-row font-sans antialiased text-textWhite relative">
      
      {/* 1. LEFT SIDEBAR NAVIGATION PANEL */}
      <aside className="hidden lg:flex flex-col w-20 xl:w-24 shrink-0 border-r border-white/10 bg-bgDark/45 backdrop-blur-md sticky top-0 h-screen justify-between items-center py-6 z-30">
        
        {/* Top Logo Shield */}
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => handleScrollTo('dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-tealAccent/20 to-tealAccent/5 border border-tealAccent/30 text-tealAccent">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Center Icons Menu list */}
        <nav className="flex flex-col gap-6 w-full px-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'risk-map', label: 'Risk Map', icon: Map },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'methodology', label: 'Methodology', icon: Cpu },
            { id: 'footer', label: 'About Us', icon: Info }
          ].map(tab => {
            const Icon = tab.icon;
            const isAct = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full py-2 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-all duration-200 group relative ${
                  isAct 
                    ? 'text-tealAccent bg-tealAccent/10' 
                    : 'text-textMuted hover:text-textWhite hover:bg-white/5'
                }`}
                title={tab.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[8px] uppercase tracking-wide font-bold">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom System Status pulse */}
        <div className="flex flex-col items-center gap-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-[8px] text-green-500 font-extrabold uppercase tracking-widest mt-1">SYSTEM ONLINE</span>
        </div>
      </aside>

      {/* 2. MAIN CONTAINER AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky top navbar */}
        <Navbar 
          onScrollTo={handleScrollTo} 
          lastUpdated={stateProfile.lastUpdated} 
        />

        {/* Core Layout Grid */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-10">
          
          {/* Redesigned Hero overview based on visual direction reference */}
          {showHero && (
            <div className="glass-panel p-6 relative overflow-hidden flex flex-col gap-6 border border-tealAccent/20 bg-gradient-to-br from-panelBg/30 to-bgDark/45 transition-all duration-300">
              <button 
                onClick={() => setShowHero(false)}
                className="absolute top-4 right-4 text-textMuted hover:text-textWhite focus:outline-none transition-colors"
                title="Dismiss Overview"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-tealAccent/10 border border-tealAccent/25 text-[10px] font-bold text-tealAccent uppercase tracking-widest w-fit">
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> India Landslide Intelligence Platform
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-textWhite leading-tight tracking-tight">
                    Protecting Lives <br />
                    Before the Hills Break.
                  </h1>
                  <p className="text-xs sm:text-sm text-textMuted max-w-xl leading-relaxed">
                    AI-powered landslide warning and geomechanical slope monitoring for India's vulnerable regions. Integrates satellite sensors, soil hydration data, and local vibration triggers to predict hazard indicators 72 hours in advance.
                  </p>
                  <div className="flex gap-3 mt-1.5">
                    <button 
                      onClick={() => handleScrollTo('dashboard')}
                      className="px-4 py-2 rounded-lg bg-tealAccent hover:bg-tealAccent/90 text-bgDark font-bold text-xs transition-colors"
                    >
                      Explore Risk Map
                    </button>
                    <a 
                      href="http://localhost:3000/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/25 text-textWhite font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      Launch Cinematic Tour &rarr;
                    </a>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2">
                    <h4 className="text-[10px] text-tealAccent font-bold uppercase tracking-wider border-b border-white/5 pb-1">
                      Why the North-East?
                    </h4>
                    <ul className="flex flex-col gap-1.5 text-[11px] text-[#8FA6B8]">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tealAccent shrink-0" />
                        <span>Among the highest rainfall in the world</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tealAccent shrink-0" />
                        <span>Steep, highly fragile mountain slopes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tealAccent shrink-0" />
                        <span>Millions living in vulnerable warning zones</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white/1 border border-white/5 text-[10px] text-[#8FA6B8] leading-relaxed">
                    <span className="font-bold text-textWhite block uppercase tracking-wider text-[8px] mb-0.5">
                      Operational Mandate
                    </span>
                    From satellite inputs and geo-climatic variables to local responders, delivering warning metrics before disaster strikes.
                  </div>
                </div>
              </div>

              {/* Bottom Visual Roadmap */}
              <div className="border-t border-white/5 pt-5 mt-2">
                <span className="text-[9px] text-[#8FA6B8] uppercase font-bold tracking-widest block mb-3">
                  Cinematic Storytelling Roadmap
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { step: '01', title: 'Earth Rotates', desc: 'A global environmental perspective' },
                    { step: '02', title: 'Focus on India', desc: 'Narrowing telemetry to the subcontinent' },
                    { step: '03', title: 'Zoom North-East', desc: 'Targeting areas at higher risk level' },
                    { step: '04', title: 'Himalayan Hills', desc: 'Observing vulnerable, steep terrain' },
                    { step: '05', title: 'Bhoomi Intelligence', desc: 'Translating parameters into warnings' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold font-mono text-tealAccent">{item.step}</span>
                      <h5 className="text-[10px] font-bold uppercase text-textWhite">{item.title}</h5>
                      <p className="text-[9px] text-textMuted leading-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Optimized Badges */}
              <div className="border-t border-white/5 pt-4 mt-1 flex flex-wrap gap-4 justify-between items-center text-[8px] text-[#8FA6B8] uppercase font-bold tracking-wider">
                <span className="text-tealAccent">🚀 Performance Optimized Architecture</span>
                <div className="flex flex-wrap gap-4">
                  <span>• Preloaded Assets</span>
                  <span>• GPU-Accelerated 60 FPS</span>
                  <span>• Cinematic Interpolation</span>
                  <span>• Video-Based Scrubber</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Map + Details Selection Section */}
          <div id="dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-20">
            
            {/* Left Side: Map visualization block */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              
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

              {/* Stats strip below map */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 glass-panel bg-panelBg/40">
                {[
                  { label: 'States Monitored', value: '36', detail: 'All India & UTs', icon: BarChart2, color: 'text-tealAccent' },
                  { label: 'High-Risk Regions', value: '8', detail: 'North-East Focus', icon: ShieldAlert, color: 'text-saffronAccent' },
                  { label: 'Forecast Window', value: '72 Hours', detail: 'AI Predictive Horizon', icon: Calendar, color: 'text-tealAccent' },
                  { label: 'Telemetry Sync', value: 'Every 3h', detail: 'Live Telemetry API', icon: RefreshCw, color: 'text-textWhite' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/8 mt-0.5">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <span className="text-[9px] text-textMuted uppercase font-bold tracking-wider block">
                        {stat.label}
                      </span>
                      <span className="text-base font-bold text-textWhite block font-mono mt-0.5">
                        {stat.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Side: Selectors & Details Profile panels */}
            <div id="risk-map" className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 scroll-mt-20">
              
              {/* Dropdowns */}
              <StateSelector 
                selectedState={selectedState}
                onSelectState={handleSelectState}
                regionFilter={regionFilter}
                onSelectRegion={handleSelectRegion}
              />

              {/* State Risk profile cards */}
              <div className="flex-1">
                <StateDetailsPanel profile={stateProfile} />
              </div>

            </div>

          </div>

          {/* Parameters grid */}
          <div>
            <ParameterGrid profile={stateProfile} />
          </div>

          {/* Charts panel */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-wide text-textWhite">Analytics Dashboard — {stateProfile.name}</h3>
              <p className="text-xs text-textMuted mt-0.5">Statistical forecast graphs and parameter weights</p>
            </div>
            <ChartsGrid profile={stateProfile} />
          </div>

          {/* Live Alerts and District Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-20">
            
            {/* Live Alerts (Left) */}
            <div id="alerts" className="lg:col-span-5 xl:col-span-6 h-full">
              <AlertsList onSelectState={handleSelectState} />
            </div>

            {/* Districts (Right) */}
            <div className="lg:col-span-7 xl:col-span-6 h-full">
              <DistrictTable 
                onSelectState={handleSelectState} 
                selectedState={selectedState} 
              />
            </div>

          </div>

          {/* Methodology */}
          <div id="methodology" className="scroll-mt-20">
            <Methodology />
          </div>

        </main>

        {/* Footer */}
        <Footer onScrollTo={handleScrollTo} />

      </div>

      {/* TOAST NOTIFICATION STACK */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className="flex items-center gap-3 p-3.5 rounded-xl border bg-panelBg/95 backdrop-blur border-white/15 text-xs text-textWhite shadow-2xl animate-slideIn pointer-events-auto w-80"
          >
            {toast.type === 'success' ? (
              <div className="p-1 rounded bg-tealAccent/20 text-tealAccent">
                <ShieldCheck className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1 rounded bg-white/10 text-textMuted">
                <Info className="w-4 h-4" />
              </div>
            )}
            <p className="font-semibold leading-snug flex-1">{toast.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default App;

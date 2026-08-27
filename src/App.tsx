import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StateSelector } from './components/StateSelector';
import { IndiaMap } from './components/Map/IndiaMap';
import { StateDetailsPanel } from './components/Details/StateDetailsPanel';
import { ParameterGrid } from './components/RiskParameters/ParameterGrid';
import { ChartsGrid } from './components/Charts/ChartsGrid';
import { AlertsList } from './components/Alerts/AlertsList';
import { DistrictTable } from './components/Districts/DistrictTable';
import { RiskSimulator } from './components/RiskParameters/RiskSimulator';
import { Methodology } from './components/Methodology';
import { Footer } from './components/Footer';
import { getFullStateProfile } from './data/mockData';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Bell, 
  Cpu, 
  Info, 
  ShieldAlert, 
  Calendar, 
  RefreshCw, 
  BarChart2, 
  ShieldCheck
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
    <div className="min-h-screen bg-[#061521] flex flex-row font-sans antialiased text-[#F4F7FA] relative">
      
      {/* 1. LEFT SIDEBAR NAVIGATION PANEL (Quiet rail navigation) */}
      <aside className="hidden lg:flex flex-col w-20 xl:w-24 shrink-0 border-r border-white/5 bg-[#061521]/90 backdrop-blur-md sticky top-0 h-screen justify-between items-center py-6 z-30">
        
        {/* Top Logo Shield */}
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => handleScrollTo('dashboard')}>
          <div className="flex items-center justify-center w-8 h-8 rounded bg-tealAccent/10 border border-tealAccent/20 text-tealAccent">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        {/* Center Icons Menu list */}
        <nav className="flex flex-col gap-6 w-full px-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'risk-map', label: 'Risk Map', icon: MapIcon },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'methodology', label: 'Methods', icon: Cpu },
            { id: 'footer', label: 'About', icon: Info }
          ].map(tab => {
            const Icon = tab.icon;
            const isAct = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full py-3.5 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 group relative ${
                  isAct 
                    ? 'text-tealAccent bg-tealAccent/5' 
                    : 'text-[#8FA6B8] hover:text-textWhite hover:bg-white/3'
                }`}
                title={tab.label}
              >
                {isAct && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-tealAccent" />
                )}
                <Icon className="w-4.5 h-4.5" />
                <span className="text-[8px] uppercase tracking-widest font-extrabold">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom System Status pulse */}
        <div className="flex flex-col items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[7px] text-green-500 font-bold uppercase tracking-widest mt-1">ONLINE</span>
        </div>
      </aside>

      {/* 2. MAIN CONTAINER AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky top navbar */}
        <Navbar 
          onScrollTo={handleScrollTo} 
          lastUpdated={stateProfile.lastUpdated} 
          activeTab={activeTab}
        />

        {/* Core Layout Grid */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">
          
          {/* Main Map + Details Selection Section */}
          <div id="dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-20">
            
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

              {/* Stats strip below map (Clean, flat, borderless card) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-white/5 my-1">
                {[
                  { label: 'States Monitored', value: '36', detail: 'All India & UTs', icon: BarChart2, color: 'text-tealAccent' },
                  { label: 'High-Risk Regions', value: '8', detail: 'North-East Focus', icon: ShieldAlert, color: 'text-saffronAccent' },
                  { label: 'Forecast Window', value: '72 Hours', detail: 'AI Predictive Horizon', icon: Calendar, color: 'text-tealAccent' },
                  { label: 'Telemetry Sync', value: 'Every 3h', detail: 'Live Telemetry API', icon: RefreshCw, color: 'text-textWhite' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="p-1 rounded bg-white/3 border border-white/5 mt-0.5 text-[#8FA6B8]">
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8FA6B8] uppercase font-bold tracking-wider block">
                        {stat.label}
                      </span>
                      <span className="text-sm font-black text-textWhite block font-mono mt-0.5">
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
              <div className="flex-1 mt-2">
                <StateDetailsPanel profile={stateProfile} />
              </div>

            </div>

          </div>

          {/* Telemetry Matrix Section */}
          <div className="border-t border-white/5 pt-8">
            <ParameterGrid profile={stateProfile} />
          </div>

          {/* Risk Simulator Sandbox Module */}
          <div className="border-t border-white/5 pt-8">
            <RiskSimulator />
          </div>

          {/* Charts panel */}
          <div className="border-t border-white/5 pt-8">
            <ChartsGrid profile={stateProfile} />
          </div>

          {/* Live Alerts and District Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/5 pt-8 scroll-mt-20">
            
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
          <div id="methodology" className="border-t border-white/5 pt-8 scroll-mt-20">
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
            className="flex items-center gap-3 p-3 rounded border bg-[#0B2030]/95 backdrop-blur border-white/10 text-xs text-textWhite shadow-2xl animate-slideIn pointer-events-auto w-80"
          >
            {toast.type === 'success' ? (
              <div className="p-1 rounded bg-tealAccent/10 text-tealAccent border border-tealAccent/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1 rounded bg-white/5 text-[#8FA6B8] border border-white/5">
                <Info className="w-4 h-4" />
              </div>
            )}
            <p className="font-bold leading-snug flex-1">{toast.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default App;

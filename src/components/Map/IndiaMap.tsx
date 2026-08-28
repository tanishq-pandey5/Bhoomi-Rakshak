import React, { useState, useRef } from 'react';
import { 
  WORLD_LAND_GEOM, 
  INDIA_STATES_PATHS 
} from './mapPaths';
import type { IndiaStatePath } from './mapPaths';
import { 
  getRiskColor, 
  getFullStateProfile 
} from '../../data/mockData';
import { Plus, Minus, Compass, Target } from 'lucide-react';

interface IndiaMapProps {
  selectedState: string;
  onSelectState: (stateName: string) => void;
  regionFilter: string;
  zoomState: 'globe' | 'india' | 'northeast';
  setZoomState: (zoom: 'globe' | 'india' | 'northeast') => void;
  onExploreMap: () => void;
  onViewAlerts: () => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  selectedState,
  onSelectState,
  regionFilter,
  zoomState,
  setZoomState,
  onExploreMap,
  onViewAlerts
}) => {
  const [hoveredStateName, setHoveredStateName] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapRef = useRef<SVGSVGElement | null>(null);

  // Manual zoom scale factor
  const [zoomScaleFactor, setZoomScaleFactor] = useState<number>(1);

  // Group paths
  const stateGroups = React.useMemo(() => {
    return INDIA_STATES_PATHS.reduce((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = [];
      }
      acc[curr.name].push(curr);
      return acc;
    }, {} as Record<string, IndiaStatePath[]>);
  }, []);

  // North-East Bounding Box (original map scale)
  const neStatesList = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];
  const neBoundingBox = React.useMemo(() => {
    const nePaths = INDIA_STATES_PATHS.filter(p => neStatesList.includes(p.name));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nePaths.forEach(p => {
      minX = Math.min(minX, p.bounds[0][0]);
      minY = Math.min(minY, p.bounds[0][1]);
      maxX = Math.max(maxX, p.bounds[1][0]);
      maxY = Math.max(maxY, p.bounds[1][1]);
    });
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, []);

  // Zoom transform for the main map area
  const getTransform = () => {
    let scale = zoomScaleFactor;
    let dx = 0;
    let dy = 0;

    if (zoomState === 'northeast') {
      scale = 2.4 * zoomScaleFactor;
      dx = -neBoundingBox.x * scale + 100;
      dy = -neBoundingBox.y * scale + 150;
      return `translate(${dx}px, ${dy}px) scale(${scale})`;
    }
    
    if (selectedState && zoomState === 'india') {
      const paths = stateGroups[selectedState];
      if (paths && paths.length > 0) {
        const [cx, cy] = paths[0].centroid;
        scale = 1.35 * zoomScaleFactor;
        dx = -cx * scale + 340;
        dy = -cy * scale + 340;
        return `translate(${dx}px, ${dy}px) scale(${scale})`;
      }
    }

    if (zoomScaleFactor !== 1) {
      scale = zoomScaleFactor;
      dx = -350 * scale + 350;
      dy = -350 * scale + 350;
      return `translate(${dx}px, ${dy}px) scale(${scale})`;
    }
    
    return 'translate(0px, 0px) scale(1)';
  };

  const handleMouseOver = (e: React.MouseEvent, stateName: string) => {
    setHoveredStateName(stateName);
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setHoverPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredStateName(null);
  };

  const isNEState = (name: string) => {
    return neStatesList.includes(name);
  };

  const getStateOpacity = (name: string) => {
    if (regionFilter === 'North-East India' && !isNEState(name)) {
      return 0.1;
    }
    if (regionFilter === 'Himalayan Region') {
      const himalayan = ["Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand", "Sikkim", "Arunachal Pradesh", "Ladakh"];
      if (!himalayan.includes(name)) return 0.1;
    }
    if (hoveredStateName && hoveredStateName !== name) {
      return 0.45;
    }
    if (selectedState && selectedState !== name) {
      return 0.35;
    }
    return 1.0;
  };

  const handleZoomIn = () => {
    setZoomScaleFactor(prev => Math.min(prev + 0.25, 4.0));
  };

  const handleZoomOut = () => {
    setZoomScaleFactor(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomScaleFactor(1);
    setZoomState('india');
  };

  // Coordinates shift math for rendering duplicated NE detail cutout
  const neDetailScale = 1.7;
  const neDetailDx = -neBoundingBox.x * neDetailScale + 550;
  const neDetailDy = -neBoundingBox.y * neDetailScale + 130;

  // Render Beacons list inside the NE cutout
  const monitoringBeacons = [
    { name: 'Guwahati', state: 'Assam', cx: 485, cy: 300 },
    { name: 'Shillong', state: 'Meghalaya', cx: 480, cy: 320 },
    { name: 'Kohima', state: 'Nagaland', cx: 520, cy: 305 },
    { name: 'Aizawl', state: 'Mizoram', cx: 505, cy: 335 },
    { name: 'Imphal', state: 'Manipur', cx: 520, cy: 320 },
    { name: 'Gangtok', state: 'Sikkim', cx: 425, cy: 285 },
    { name: 'Itanagar', state: 'Arunachal Pradesh', cx: 510, cy: 280 }
  ];

  return (
    <div className="relative glass-panel flex flex-col w-full h-[580px] select-none overflow-hidden border border-[#29A9FF]/10">
      
      {/* 1. MAP CONTROLS OVERLAY (Left Edge) */}
      <div className="absolute left-6 top-8 z-20 flex flex-col gap-2 pointer-events-auto">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 rounded bg-[#08264A]/80 border border-[#29A9FF]/20 flex items-center justify-center text-[#A7B6CC] hover:text-[#29A9FF] hover:bg-[#29A9FF]/10 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 rounded bg-[#08264A]/80 border border-[#29A9FF]/20 flex items-center justify-center text-[#A7B6CC] hover:text-[#29A9FF] hover:bg-[#29A9FF]/10 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleResetZoom}
          className="w-8 h-8 rounded bg-[#08264A]/80 border border-[#29A9FF]/20 flex items-center justify-center text-[#A7B6CC] hover:text-[#29A9FF] hover:bg-[#29A9FF]/10 transition-colors"
          title="Reset Map View"
        >
          <Target className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => {
            setZoomState('northeast');
            setZoomScaleFactor(1);
          }}
          className={`px-3 py-1.5 rounded bg-[#08264A]/80 border text-[9px] font-bold uppercase transition-all whitespace-nowrap mt-3 ${
            zoomState === 'northeast' 
              ? 'border-[#29A9FF] text-[#29A9FF] bg-[#29A9FF]/10' 
              : 'border-[#29A9FF]/20 text-[#A7B6CC] hover:text-[#F5F7FA] hover:border-[#29A9FF]'
          }`}
        >
          Focus North-East
        </button>
        <button
          onClick={() => {
            setZoomState('india');
            setZoomScaleFactor(1);
          }}
          className={`px-3 py-1.5 rounded bg-[#08264A]/80 border text-[9px] font-bold uppercase transition-all whitespace-nowrap ${
            zoomState === 'india' 
              ? 'border-[#29A9FF] text-[#29A9FF] bg-[#29A9FF]/10' 
              : 'border-[#29A9FF]/20 text-[#A7B6CC] hover:text-[#F5F7FA] hover:border-[#29A9FF]'
          }`}
        >
          View All India
        </button>
      </div>

      {/* 2. DYNAMIC HOVER STATE LABEL OVERLAY (Floating near state) */}
      {hoveredStateName && (() => {
        const profile = getFullStateProfile(hoveredStateName);
        return (
          <div 
            className="absolute pointer-events-none z-30 bg-[#06152B]/95 border border-[#29A9FF]/25 px-3.5 py-2 text-xs flex flex-col gap-1.5 rounded-lg shadow-xl"
            style={{ 
              left: `${hoverPos.x + 15}px`, 
              top: `${hoverPos.y - 45}px`,
              transform: 'translate(-50%, -50%)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="font-bold text-[#F5F7FA] uppercase tracking-wider flex items-center gap-1.5">
              <span>{hoveredStateName}</span>
              {isNEState(hoveredStateName) && (
                <span className="bg-[#29A9FF]/10 border border-[#29A9FF]/20 text-[#29A9FF] text-[8px] px-1 rounded font-bold">NE</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: getRiskColor(profile.riskLevel) }}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#F5F7FA]" style={{ color: getRiskColor(profile.riskLevel) }}>
                {profile.riskPercentage}% {profile.riskLevel} Risk
              </span>
            </div>
            <span className="text-[9px] text-[#71839C] border-t border-white/5 pt-1 mt-0.5">
              {profile.riskTrend === 'Rising' ? '↑ Rising' : profile.riskTrend === 'Falling' ? '↓ Falling' : '• Stable'} outlook
            </span>
          </div>
        );
      })()}

      {/* Main SVG Render Viewport */}
      <div className="relative flex-1 flex items-center justify-center">
        <svg
          ref={mapRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 580"
          className="w-full h-full"
        >
          {/* Main India map group subject to zoom transform */}
          <g 
            style={{ transform: getTransform(), transformOrigin: '280px 280px', transition: 'transform 0.50s cubic-bezier(0.1, 0.8, 0.2, 1)' }}
          >
            {Object.keys(stateGroups).map((stateName) => {
              const paths = stateGroups[stateName];
              const stateProfile = getFullStateProfile(stateName);
              const riskColor = getRiskColor(stateProfile.riskLevel);
              const isSelected = selectedState === stateName;
              const isHovered = hoveredStateName === stateName;
              const opacity = getStateOpacity(stateName);

              return (
                <g
                  key={stateName}
                  onClick={() => onSelectState(stateName)}
                  onMouseMove={(e) => handleMouseOver(e, stateName)}
                  onMouseLeave={handleMouseLeave}
                  className="cursor-pointer group"
                  style={{ opacity, transition: 'opacity 0.25s ease' }}
                >
                  {paths.map((p, idx) => (
                    <path
                      key={idx}
                      d={p.path}
                      fill={riskColor}
                      stroke={isHovered ? '#29A9FF' : isSelected ? '#F5F7FA' : 'rgba(3, 11, 28, 0.8)'}
                      strokeWidth={isHovered ? 1.5 : isSelected ? 2.2 : 0.6}
                      className="transition-all duration-200 group-hover:brightness-105"
                    />
                  ))}
                </g>
              );
            })}

            {/* Glowing Live Telemetry Pin centroid indicator on active main map selection */}
            {selectedState && (() => {
              const paths = stateGroups[selectedState];
              if (paths && paths.length > 0) {
                const [cx, cy] = paths[0].centroid;
                return (
                  <g className="pointer-events-none">
                    <circle cx={cx} cy={cy} r={14} fill="none" stroke="#32D583" strokeWidth={1.5} className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
                    <circle cx={cx} cy={cy} r={4.5} fill="#32D583" stroke="#F5F7FA" strokeWidth={1} />
                  </g>
                );
              }
            })()}
          </g>

          {/* 3. ENLARGED NORTH-EAST DETAIL CUTOUT WINDOW (Visible when not zoomed in elsewhere) */}
          {zoomState !== 'northeast' && (
            <g className="pointer-events-auto">
              
              {/* Connector link lines */}
              <line x1="470" y1="280" x2="540" y2="280" stroke="#29A9FF" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
              
              {/* Outer Enclosing Glass rect boundary */}
              <rect x="535" y="120" width="240" height="260" rx="12" fill="rgba(6, 21, 43, 0.5)" stroke="rgba(41, 169, 255, 0.15)" strokeWidth="1" />
              <text x="550" y="142" fill="#29A9FF" fontSize="9" fontWeight="800" letterSpacing="0.1em" className="uppercase font-sans">North-East Detail View</text>
              
              {/* North-East states paths scaled and shifted into the box */}
              <g 
                style={{ transform: `translate(${neDetailDx}px, ${neDetailDy}px) scale(${neDetailScale})` }}
              >
                {neStatesList.map((stateName) => {
                  const paths = stateGroups[stateName];
                  if (!paths) return null;
                  const stateProfile = getFullStateProfile(stateName);
                  const riskColor = getRiskColor(stateProfile.riskLevel);
                  const isSelected = selectedState === stateName;
                  const isHovered = hoveredStateName === stateName;
                  const opacity = getStateOpacity(stateName);

                  return (
                    <g
                      key={`${stateName}-detail`}
                      onClick={() => onSelectState(stateName)}
                      onMouseMove={(e) => handleMouseOver(e, stateName)}
                      onMouseLeave={handleMouseLeave}
                      className="cursor-pointer group"
                      style={{ opacity, transition: 'opacity 0.25s ease' }}
                    >
                      {paths.map((p, idx) => (
                        <path
                          key={idx}
                          d={p.path}
                          fill={riskColor}
                          stroke={isHovered ? '#29A9FF' : isSelected ? '#F5F7FA' : 'rgba(3, 11, 28, 0.8)'}
                          strokeWidth={isHovered ? 1.5 : isSelected ? 2.2 : 0.6}
                          className="transition-all duration-200 group-hover:brightness-105"
                        />
                      ))}
                    </g>
                  );
                })}
              </g>

              {/* Geolocated monitoring beacons with pulsing rings inside NE bubble */}
              {monitoringBeacons.map((beacon, idx) => {
                const stateProfile = getFullStateProfile(beacon.state);
                const color = getRiskColor(stateProfile.riskLevel);
                // Scale beacon centroids to NE detail coordinate space
                const bx = beacon.cx * neDetailScale + neDetailDx;
                const by = beacon.cy * neDetailScale + neDetailDy;

                return (
                  <g key={idx} className="cursor-pointer" onClick={() => onSelectState(beacon.state)}>
                    <circle cx={bx} cy={by} r={8} fill="none" stroke={color} strokeWidth={1} className="animate-ping" style={{ transformOrigin: `${bx}px ${by}px` }} />
                    <circle cx={bx} cy={by} r={3} fill={color} />
                  </g>
                );
              })}
            </g>
          )}

        </svg>
      </div>

      {/* 4. HORIZONTAL RISK SEVERITY LEGEND (Bottom Strip) */}
      <div className="border-t border-white/5 px-6 py-3 flex flex-wrap items-center justify-between gap-4 bg-[#030B1C]/60">
        <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest leading-none">
          Risk Severity Index
        </span>
        <div className="flex flex-wrap gap-4 overflow-x-auto">
          {[
            { label: 'Critical', color: '#B91C1C' },
            { label: 'Very High', color: '#FF4D5A' },
            { label: 'High', color: '#FF8A3D' },
            { label: 'Moderate', color: '#F5C451' },
            { label: 'Low', color: '#84CC16' },
            { label: 'Very Low', color: '#32D583' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[9px] text-[#A7B6CC] font-bold uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useState, useRef } from 'react';
import { 
  INDIA_STATES_PATHS 
} from './mapPaths';
import type { IndiaStatePath } from './mapPaths';
import { 
  getRiskColor, 
  getFullStateProfile 
} from '../../data/mockData';
import { Plus, Minus, Target } from 'lucide-react';

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
  setZoomState
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

  // Zoom transform for the main map area - adjusted projection coordinates to center properly
  const getTransform = () => {
    let scale = zoomScaleFactor;
    let dx = 0;
    let dy = 0;

    if (zoomState === 'northeast') {
      scale = 2.2 * zoomScaleFactor;
      dx = -neBoundingBox.x * scale + 120;
      dy = -neBoundingBox.y * scale + 130;
      return `translate(${dx}px, ${dy}px) scale(${scale})`;
    }
    
    if (selectedState && zoomState === 'india') {
      const paths = stateGroups[selectedState];
      if (paths && paths.length > 0) {
        const [cx, cy] = paths[0].centroid;
        scale = 1.2 * zoomScaleFactor;
        dx = -cx * scale + 240;
        dy = -cy * scale + 260;
        return `translate(${dx}px, ${dy}px) scale(${scale})`;
      }
    }

    if (zoomScaleFactor !== 1) {
      scale = zoomScaleFactor;
      dx = -280 * scale + 280;
      dy = -280 * scale + 280;
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
      return 0.15;
    }
    if (regionFilter === 'Himalayan Region') {
      const himalayan = ["Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand", "Sikkim", "Arunachal Pradesh", "Ladakh"];
      if (!himalayan.includes(name)) return 0.15;
    }
    if (hoveredStateName && hoveredStateName !== name) {
      return 0.4;
    }
    if (selectedState && selectedState !== name) {
      return 0.3;
    }
    return 1.0;
  };

  const handleZoomIn = () => {
    setZoomScaleFactor(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setZoomScaleFactor(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleResetZoom = () => {
    setZoomScaleFactor(1);
    setZoomState('india');
  };

  // Shift values for rendering NE cutout bubble
  const neDetailScale = 1.6;
  const neDetailDx = -neBoundingBox.x * neDetailScale + 520;
  const neDetailDy = -neBoundingBox.y * neDetailScale + 120;

  // Geolocated monitoring beacons with pulsing rings
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
    <div className="relative flex flex-col w-full h-[650px] select-none overflow-hidden bg-transparent border-none shadow-none">
      
      {/* Zoom Controls Overlay (Floating left side) */}
      <div className="absolute left-0 top-8 z-20 flex flex-col gap-2.5">
        <button 
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-full bg-[#08264A]/80 border border-white/5 flex items-center justify-center text-[#A7B6CC] hover:text-[#29A9FF] hover:bg-[#29A9FF]/10 backdrop-blur-md transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-full bg-[#08264A]/80 border border-white/5 flex items-center justify-center text-[#A7B6CC] hover:text-[#29A9FF] hover:bg-[#29A9FF]/10 backdrop-blur-md transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleResetZoom}
          className="w-9 h-9 rounded-full bg-[#08264A]/80 border border-white/5 flex items-center justify-center text-[#A7B6CC] hover:text-[#29A9FF] hover:bg-[#29A9FF]/10 backdrop-blur-md transition-colors"
          title="Reset Map View"
        >
          <Target className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => {
            setZoomState('northeast');
            setZoomScaleFactor(1);
          }}
          className={`px-3.5 py-2 rounded-full border text-[9px] font-bold uppercase transition-all whitespace-nowrap mt-4 ${
            zoomState === 'northeast' 
              ? 'border-[#29A9FF] text-[#29A9FF] bg-[#29A9FF]/10' 
              : 'border-white/5 bg-[#08264A]/60 text-[#A7B6CC] hover:text-[#F5F7FB] hover:border-white/20'
          }`}
        >
          Focus North-East
        </button>
        <button
          onClick={() => {
            setZoomState('india');
            setZoomScaleFactor(1);
          }}
          className={`px-3.5 py-2 rounded-full border text-[9px] font-bold uppercase transition-all whitespace-nowrap ${
            zoomState === 'india' 
              ? 'border-[#29A9FF] text-[#29A9FF] bg-[#29A9FF]/10' 
              : 'border-white/5 bg-[#08264A]/60 text-[#A7B6CC] hover:text-[#F5F7FB] hover:border-white/20'
          }`}
        >
          View All India
        </button>
      </div>

      {/* Hover Information Tooltip */}
      {hoveredStateName && (() => {
        const profile = getFullStateProfile(hoveredStateName);
        return (
          <div 
            className="absolute pointer-events-none z-30 bg-[#06152B]/95 border border-[#29A9FF]/20 px-4 py-2.5 text-xs flex flex-col gap-1.5 rounded-lg shadow-xl"
            style={{ 
              left: `${hoverPos.x + 20}px`, 
              top: `${hoverPos.y - 50}px`,
              transform: 'translate(-50%, -50%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="font-extrabold text-[#F5F7FB] uppercase tracking-wider flex items-center gap-2">
              <span>{hoveredStateName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: getRiskColor(profile.riskLevel) }}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: getRiskColor(profile.riskLevel) }}>
                {profile.riskPercentage}% {profile.riskLevel} Risk
              </span>
            </div>
          </div>
        );
      })()}

      {/* Main SVG Container */}
      <div className="relative flex-1 flex items-center justify-center">
        <svg
          ref={mapRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 650"
          className="w-full h-full"
        >
          {/* Main India map group */}
          <g 
            style={{ transform: getTransform(), transformOrigin: '320px 320px', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
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
                      fill={isSelected ? '#08264A' : 'rgba(8, 24, 48, 0.9)'}
                      stroke={isHovered ? '#29A9FF' : isSelected ? '#55C7FF' : 'rgba(41, 169, 255, 0.12)'}
                      strokeWidth={isHovered ? 1.5 : isSelected ? 2.0 : 0.6}
                      className="transition-all duration-300 group-hover:fill-[#08264A]/80"
                    />
                  ))}
                </g>
              );
            })}

            {/* Glowing concentric selected centroid beacon */}
            {selectedState && (() => {
              const paths = stateGroups[selectedState];
              if (paths && paths.length > 0) {
                const [cx, cy] = paths[0].centroid;
                return (
                  <g className="pointer-events-none">
                    <circle cx={cx} cy={cy} r={12} fill="none" stroke="#29A9FF" strokeWidth={1} className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
                    <circle cx={cx} cy={cy} r={4.5} fill="#29A9FF" stroke="#F5F7FB" strokeWidth={1} />
                  </g>
                );
              }
            })()}
          </g>

          {/* Enlarged NE Cutout Bubble (Right Edge) */}
          {zoomState !== 'northeast' && (
            <g className="pointer-events-auto">
              
              {/* Dash connector to original map */}
              <line x1="450" y1="280" x2="520" y2="280" stroke="#29A9FF" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
              
              {/* Detail boundary bubble - border-white/5 glass style */}
              <rect x="525" y="140" width="250" height="270" rx="16" fill="rgba(8, 24, 48, 0.4)" stroke="rgba(120, 180, 255, 0.08)" strokeWidth="1" />
              <text x="545" y="165" fill="#55C7FF" fontSize="9" fontWeight="800" letterSpacing="0.12em" className="uppercase font-sans">North-East Watch Detail</text>
              
              {/* NE cutout paths */}
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
                          fill={isSelected ? '#08264A' : 'rgba(8, 24, 48, 0.9)'}
                          stroke={isHovered ? '#29A9FF' : isSelected ? '#55C7FF' : 'rgba(41, 169, 255, 0.12)'}
                          strokeWidth={isHovered ? 1.5 : isSelected ? 2.0 : 0.6}
                          className="transition-all duration-300 group-hover:fill-[#08264A]/80"
                        />
                      ))}
                    </g>
                  );
                })}
              </g>

              {/* Centroid monitoring pins inside detail bubble */}
              {monitoringBeacons.map((beacon, idx) => {
                const stateProfile = getFullStateProfile(beacon.state);
                const color = getRiskColor(stateProfile.riskLevel);
                const bx = beacon.cx * neDetailScale + neDetailDx;
                const by = beacon.cy * neDetailScale + neDetailDy;

                return (
                  <g key={idx} className="cursor-pointer" onClick={() => onSelectState(beacon.state)}>
                    <circle cx={bx} cy={by} r={6} fill="none" stroke={color} strokeWidth={1} className="animate-ping" style={{ transformOrigin: `${bx}px ${by}px` }} />
                    <circle cx={bx} cy={by} r={3.5} fill={color} stroke="#030B1C" strokeWidth={1} />
                  </g>
                );
              })}
            </g>
          )}

        </svg>
      </div>

      {/* Horizontal Legend at the bottom of the map block */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 mt-2">
        <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest leading-none">
          Risk Severity Scale
        </span>
        <div className="flex flex-wrap gap-5">
          {[
            { label: 'Critical', color: '#B91C1C' },
            { label: 'Very High', color: '#FF4D5A' },
            { label: 'High', color: '#FF8A3D' },
            { label: 'Moderate', color: '#F5C451' },
            { label: 'Low', color: '#84CC16' },
            { label: 'Very Low', color: '#32D583' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[9px] text-[#A7B6CC] font-bold uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

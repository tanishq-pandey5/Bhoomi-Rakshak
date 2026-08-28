import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3-geo';
import { 
  WORLD_LAND_GEOM, 
  INDIA_STATES_PATHS 
} from './mapPaths';
import type { IndiaStatePath } from './mapPaths';
import { 
  getRiskColor, 
  getFullStateProfile 
} from '../../data/mockData';
import { Plus, Minus, Compass } from 'lucide-react';

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
  // Globe rotation state
  const [rotation, setRotation] = useState<number>(78); 
  const [hoveredState, setHoveredState] = useState<IndiaStatePath | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapRef = useRef<SVGSVGElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Manual zoom factor
  const [zoomScaleFactor, setZoomScaleFactor] = useState<number>(1);

  // Auto-rotate the globe when in globe state
  useEffect(() => {
    if (zoomState === 'globe') {
      const rotate = () => {
        setRotation(prev => (prev + 0.12) % 360);
        animationFrameId.current = requestAnimationFrame(rotate);
      };
      animationFrameId.current = requestAnimationFrame(rotate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [zoomState]);

  // Group multiple path segments of the same state
  const stateGroups = React.useMemo(() => {
    return INDIA_STATES_PATHS.reduce((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = [];
      }
      acc[curr.name].push(curr);
      return acc;
    }, {} as Record<string, IndiaStatePath[]>);
  }, []);

  // Compute union bounding box for North-East region
  const neBoundingBox = React.useMemo(() => {
    const neStates = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];
    const nePaths = INDIA_STATES_PATHS.filter(p => neStates.includes(p.name));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    nePaths.forEach(p => {
      minX = Math.min(minX, p.bounds[0][0]);
      minY = Math.min(minY, p.bounds[0][1]);
      maxX = Math.max(maxX, p.bounds[1][0]);
      maxY = Math.max(maxY, p.bounds[1][1]);
    });
    
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, []);

  // Get active transform based on zoom state
  const getTransform = () => {
    let scale = zoomScaleFactor;
    let dx = 0;
    let dy = 0;

    if (zoomState === 'northeast') {
      scale = 2.8 * zoomScaleFactor;
      dx = -neBoundingBox.x * scale + 130;
      dy = -neBoundingBox.y * scale + 180;
      return `translate(${dx}px, ${dy}px) scale(${scale})`;
    }
    
    if (selectedState && zoomState === 'india') {
      const paths = stateGroups[selectedState];
      if (paths && paths.length > 0) {
        const firstPath = paths[0];
        const [cx, cy] = firstPath.centroid;
        scale = 1.35 * zoomScaleFactor;
        dx = -cx * scale + 400;
        dy = -cy * scale + 400;
        return `translate(${dx}px, ${dy}px) scale(${scale})`;
      }
    }

    if (zoomState === 'india' && zoomScaleFactor !== 1) {
      scale = zoomScaleFactor;
      dx = -400 * scale + 400;
      dy = -400 * scale + 400;
      return `translate(${dx}px, ${dy}px) scale(${scale})`;
    }
    
    return 'translate(0px, 0px) scale(1)';
  };

  // Configure Globe Projection
  const globeProjection = d3.geoOrthographic()
    .clipAngle(90)
    .scale(260) // Slightly larger globe as in screenshot
    .translate([460, 420])
    .rotate([rotation, -20]);

  const globePathGenerator = d3.geoPath(globeProjection);

  const isIndiaVisible = () => {
    const coords: [number, number] = [78.96, 20.59];
    const rotated = globeProjection.rotate();
    const distance = d3.geoDistance(coords, [-rotated[0], -rotated[1]]);
    return distance < Math.PI / 2;
  };

  const beaconPos = isIndiaVisible() ? globeProjection([78.96, 20.59]) : null;

  const handleMouseOver = (e: React.MouseEvent, stateName: string) => {
    const paths = stateGroups[stateName];
    if (paths && paths.length > 0) {
      setHoveredState(paths[0]);
    }
    
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setHoverPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const isNEState = (name: string) => {
    return ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"].includes(name);
  };

  const getStateOpacity = (name: string) => {
    if (regionFilter === 'North-East India' && !isNEState(name)) {
      return 0.12;
    }
    if (regionFilter === 'Himalayan Region') {
      const himalayan = ["Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand", "Sikkim", "Arunachal Pradesh", "Ladakh"];
      if (!himalayan.includes(name)) return 0.12;
    }
    if (selectedState && selectedState !== name) {
      return 0.3;
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
    if (zoomState === 'globe') {
      setZoomState('india');
    } else {
      setZoomState('globe');
    }
  };

  return (
    <div className="relative glass-panel flex flex-col w-full h-[620px] select-none overflow-hidden">
      
      {/* 1. TOP-LEFT OVERLAY (India Landslide Risk Intelligence Text & CTA Buttons) */}
      <div className="absolute top-6 left-6 z-20 max-w-sm pointer-events-auto">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-tealAccent/10 border border-tealAccent/20 text-[10px] font-bold text-tealAccent uppercase tracking-widest mb-3">
          AI-Powered Early Warning
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-textWhite leading-tight tracking-tight">
          India Landslide <br />
          Risk Intelligence
        </h1>
        <p className="mt-2 text-xs text-textMuted leading-relaxed">
          Monitor rainfall, terrain, soil, seismic, and sensor indicators to predict landslide risk up to 72 hours in advance.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setZoomState('india');
              onExploreMap();
            }}
            className="px-4 py-2 rounded-lg bg-tealAccent hover:bg-tealAccent/90 text-bgDark font-bold text-xs transition-colors duration-150"
          >
            Explore Risk Map →
          </button>
          <button
            onClick={onViewAlerts}
            className="px-4 py-2 rounded-lg border border-white/8 bg-bgDark/60 hover:bg-white/5 text-textWhite font-semibold text-xs transition-colors duration-150"
          >
            View Live Alerts
          </button>
        </div>
      </div>

      {/* 2. MAP CONTROLS OVERLAY (Bottom-Left) */}
      {zoomState !== 'globe' && (
        <div className="absolute bottom-6 left-6 z-20 glass-panel p-3 flex flex-col gap-3 w-44">
          <span className="text-[9px] text-textMuted uppercase font-bold tracking-wider block border-b border-white/5 pb-1">
            Map Controls
          </span>
          
          {/* Zoom controls: Plus, Minus, Reset */}
          <div className="flex items-center gap-2 justify-between">
            <button 
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-textMuted hover:text-textWhite hover:bg-white/10"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-textMuted hover:text-textWhite hover:bg-white/10"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button 
              onClick={handleResetZoom}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-textMuted hover:text-textWhite hover:bg-white/10"
              title="Reset Map"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          {/* Quick select zooms */}
          <div className="flex flex-col gap-1.5 mt-1">
            <button
              onClick={() => {
                setZoomState('northeast');
                setZoomScaleFactor(1);
              }}
              className={`w-full py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all duration-150 ${
                zoomState === 'northeast' 
                  ? 'bg-saffronAccent/10 border-saffronAccent/30 text-saffronAccent' 
                  : 'bg-white/5 border-white/8 text-textMuted hover:text-textWhite'
              }`}
            >
              Focus on North-East
            </button>
            
            <button
              onClick={() => {
                setZoomState('india');
                setZoomScaleFactor(1);
              }}
              className={`w-full py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all duration-150 ${
                zoomState === 'india' 
                  ? 'bg-tealAccent/10 border-tealAccent/30 text-tealAccent' 
                  : 'bg-white/5 border-white/8 text-textMuted hover:text-textWhite'
              }`}
            >
              View All India
            </button>
          </div>
        </div>
      )}

      {/* Main SVG Render Window */}
      <div className="relative flex-1 flex items-center justify-center">
        
        {/* GLOBE VIEW */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-750 ease-out ${
          zoomState === 'globe' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <div className="absolute w-[460px] h-[460px] rounded-full bg-tealAccent/5 blur-3xl -z-10" />
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 800 800" 
            className="w-full max-w-[550px] aspect-square"
          >
            <path 
              d={globePathGenerator({ type: 'Sphere' }) || undefined} 
              fill="rgba(8, 25, 41, 0.85)" 
              stroke="rgba(22, 184, 166, 0.15)" 
              strokeWidth={1.2} 
            />
            
            <path 
              d={globePathGenerator(d3.geoGraticule().step([15, 15])()) || undefined} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.03)" 
              strokeWidth={0.5} 
            />

            {WORLD_LAND_GEOM.map((geom, idx) => {
              const pathStr = globePathGenerator(geom as any);
              if (!pathStr) return null;
              return (
                <path
                  key={idx}
                  d={pathStr}
                  fill="rgba(30, 58, 86, 0.45)"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={0.5}
                />
              );
            })}

            {/* Glowing India beacon and outline coordinates */}
            {beaconPos && (
              <g className="cursor-pointer" onClick={() => setZoomState('india')}>
                <circle 
                  cx={beaconPos[0]} 
                  cy={beaconPos[1]} 
                  r={26} 
                  fill="url(#tealGlowMap)" 
                  className="animate-pulse"
                />
                <circle 
                  cx={beaconPos[0]} 
                  cy={beaconPos[1]} 
                  r={8} 
                  fill="#16B8A6"
                />
                <circle 
                  cx={beaconPos[0]} 
                  cy={beaconPos[1]} 
                  r={3} 
                  fill="#FFFFFF"
                />
              </g>
            )}

            <defs>
              <radialGradient id="tealGlowMap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#16B8A6" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#16B8A6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#16B8A6" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Globe View overlay explore prompt */}
          <div className="absolute bottom-10 flex flex-col items-center gap-1.5 z-20">
            <button
              onClick={() => setZoomState('india')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-tealAccent to-tealAccent/80 hover:from-tealAccent hover:to-tealAccent text-bgDark font-bold text-xs tracking-wider shadow-lg hover:shadow-tealAccent/25 hover:scale-105 transition-all duration-200"
            >
              EXPLORE RISK MAP
            </button>
            <span className="text-[9px] text-textMuted tracking-wider font-semibold uppercase">Click to render national map</span>
          </div>
        </div>

        {/* INDIA MAP VIEW */}
        <div className={`absolute inset-0 transition-all duration-750 ease-out ${
          zoomState !== 'globe' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <svg
            ref={mapRef}
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            className="w-full h-full max-h-[550px] aspect-square transition-all duration-500 ease-in-out"
            style={{ transform: getTransform(), transformOrigin: 'center center' }}
          >
            {zoomState === 'northeast' && (
              <circle cx="655" cy="285" r="160" fill="url(#neSaffronGlowMap)" />
            )}

            <g>
              {Object.keys(stateGroups).map((stateName) => {
                const paths = stateGroups[stateName];
                const stateProfile = getFullStateProfile(stateName);
                const riskColor = getRiskColor(stateProfile.riskLevel);
                const isSelected = selectedState === stateName;
                const opacity = getStateOpacity(stateName);

                return (
                  <g
                    key={stateName}
                    onClick={() => onSelectState(stateName)}
                    onMouseMove={(e) => handleMouseOver(e, stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    className="cursor-pointer group"
                    style={{ opacity, transition: 'opacity 0.3s ease' }}
                  >
                    {paths.map((p, idx) => (
                      <path
                        key={idx}
                        d={p.path}
                        fill={riskColor}
                        stroke={isSelected ? '#16B8A6' : 'rgba(7, 26, 43, 0.75)'}
                        strokeWidth={isSelected ? 2.5 : 0.8}
                        className={`transition-all duration-250 group-hover:brightness-110 ${
                          isSelected ? 'filter drop-shadow-[0_0_8px_rgba(22,184,166,0.5)]' : ''
                        }`}
                      />
                    ))}
                  </g>
                );
              })}
            </g>

            <defs>
              <radialGradient id="neSaffronGlowMap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF9F43" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FF9F43" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Tooltip on Hover */}
        {hoveredState && zoomState !== 'globe' && (() => {
          const profile = getFullStateProfile(hoveredState.name);
          return (
            <div 
              className="absolute pointer-events-none z-30 glass-panel px-3 py-2 text-xs flex flex-col gap-1 border-white/20 shadow-xl"
              style={{ 
                left: `${hoverPos.x + 15}px`, 
                top: `${hoverPos.y - 45}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="font-semibold text-textWhite flex items-center gap-1.5">
                <span>{hoveredState.name}</span>
                {isNEState(hoveredState.name) && (
                  <span className="bg-saffronAccent/20 text-saffronAccent text-[9px] px-1.5 rounded-full font-bold">NE</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getRiskColor(profile.riskLevel) }}
                />
                <span className="text-textMuted uppercase text-[9px] font-bold tracking-wider">
                  {profile.riskLevel} ({profile.riskPercentage}%)
                </span>
              </div>
            </div>
          );
        })()}
      </div>

    </div>
  );
};

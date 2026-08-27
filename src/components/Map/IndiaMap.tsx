import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const stateGroups = useMemo(() => {
    return INDIA_STATES_PATHS.reduce((acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = [];
      }
      acc[curr.name].push(curr);
      return acc;
    }, {} as Record<string, IndiaStatePath[]>);
  }, []);

  // Compute union bounding box for North-East region
  const neBoundingBox = useMemo(() => {
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

  const selectedProfile = useMemo(() => {
    return getFullStateProfile(selectedState);
  }, [selectedState]);

  const selectedRiskColor = useMemo(() => {
    return getRiskColor(selectedProfile.riskLevel);
  }, [selectedProfile]);

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
    .scale(260)
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
    if (zoomState === 'globe') {
      setZoomState('india');
    } else {
      setZoomState('globe');
    }
  };

  return (
    <div className="relative flex flex-col w-full h-[580px] select-none overflow-hidden rounded-xl border border-white/8 bg-[#0B2030]/40">
      
      {/* 1. TOP-LEFT OVERLAY (Branding intelligence headers) */}
      <div className="absolute top-6 left-6 z-20 max-w-sm pointer-events-auto">
        <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
          AI-POWERED LANDSLIDE INTELLIGENCE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-textWhite leading-tight tracking-tight uppercase">
          India Landslide <br />
          Risk Intelligence
        </h1>
        <p className="mt-2.5 text-xs text-textMuted leading-relaxed">
          Monitor environmental signals and identify emerging landslide risk up to 72 hours in advance.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setZoomState('india');
              onExploreMap();
            }}
            className="px-4 py-2 rounded bg-tealAccent hover:bg-tealAccent/90 text-bgDark font-bold text-xs tracking-wider uppercase active:scale-95 transition-all duration-150"
          >
            Explore Risk Map
          </button>
          <button
            onClick={onViewAlerts}
            className="px-4 py-2 rounded border border-white/10 bg-bgDark/40 hover:bg-white/5 text-textWhite font-bold text-xs tracking-wider uppercase active:scale-95 transition-all duration-150"
          >
            View Alerts
          </button>
        </div>
      </div>

      {/* 2. TOP-RIGHT OVERLAY (Compact Contextual Map Annotation) */}
      {selectedState && zoomState !== 'globe' && (
        <div className="absolute top-6 right-6 z-20 bg-[#0B2030]/90 border border-white/8 backdrop-blur-md px-3.5 py-2 rounded flex flex-col items-end text-right">
          <span className="text-[9px] text-textMuted uppercase font-bold tracking-widest">Active Target</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-extrabold text-textWhite uppercase">{selectedState}</span>
            <span className="text-xs font-mono font-black" style={{ color: selectedRiskColor }}>
              {selectedProfile.riskPercentage}%
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold mt-0.5" style={{ color: selectedRiskColor }}>
            {selectedProfile.riskLevel} Risk • 72H Outlook
          </span>
        </div>
      )}

      {/* 3. MAP CONTROLS OVERLAY (Bottom-Left) */}
      {zoomState !== 'globe' && (
        <div className="absolute bottom-6 left-6 z-20 bg-[#0B2030]/80 border border-white/8 backdrop-blur-md p-2.5 flex flex-col gap-2 rounded shadow-xl">
          {/* Zoom controls: Plus, Minus, Reset */}
          <div className="flex items-center gap-1.5 justify-between">
            <button 
              onClick={handleZoomIn}
              className="w-7 h-7 rounded bg-white/5 border border-white/8 flex items-center justify-center text-textMuted hover:text-textWhite hover:bg-white/10"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-7 h-7 rounded bg-white/5 border border-white/8 flex items-center justify-center text-textMuted hover:text-textWhite hover:bg-white/10"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleResetZoom}
              className="w-7 h-7 rounded bg-white/5 border border-white/8 flex items-center justify-center text-textMuted hover:text-textWhite hover:bg-white/10"
              title="Reset Zoom"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick select zooms */}
          <div className="flex gap-1">
            <button
              onClick={() => {
                setZoomState('northeast');
                setZoomScaleFactor(1);
              }}
              className={`px-2 py-1 text-[8px] font-bold uppercase rounded border transition-all duration-150 ${
                zoomState === 'northeast' 
                  ? 'bg-saffronAccent/10 border-saffronAccent/30 text-saffronAccent' 
                  : 'bg-white/3 border-white/5 text-textMuted hover:text-textWhite'
              }`}
            >
              NE Focus
            </button>
            
            <button
              onClick={() => {
                setZoomState('india');
                setZoomScaleFactor(1);
              }}
              className={`px-2 py-1 text-[8px] font-bold uppercase rounded border transition-all duration-150 ${
                zoomState === 'india' 
                  ? 'bg-tealAccent/10 border-tealAccent/30 text-tealAccent' 
                  : 'bg-white/3 border-white/5 text-textMuted hover:text-textWhite'
              }`}
            >
              India View
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
          <div className="absolute w-[440px] h-[440px] rounded-full bg-tealAccent/5 blur-3xl -z-10" />
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 800 800" 
            className="w-full max-w-[500px] aspect-square"
          >
            <path 
              d={globePathGenerator({ type: 'Sphere' }) || undefined} 
              fill="rgba(6, 21, 33, 0.9)" 
              stroke="rgba(22, 184, 166, 0.15)" 
              strokeWidth={1.2} 
            />
            
            <path 
              d={globePathGenerator(d3.geoGraticule().step([15, 15])()) || undefined} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.02)" 
              strokeWidth={0.5} 
            />

            {WORLD_LAND_GEOM.map((geom, idx) => {
              const pathStr = globePathGenerator(geom as any);
              if (!pathStr) return null;
              return (
                <path
                  key={idx}
                  d={pathStr}
                  fill="rgba(30, 58, 86, 0.35)"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth={0.5}
                />
              );
            })}

            {/* Glowing India beacon */}
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
                  r={7} 
                  fill="#16B8A6"
                />
                <circle 
                  cx={beaconPos[0]} 
                  cy={beaconPos[1]} 
                  r={2.5} 
                  fill="#FFFFFF"
                />
              </g>
            )}

            <defs>
              <radialGradient id="tealGlowMap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#16B8A6" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#16B8A6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#16B8A6" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Globe View Overlay explore prompt */}
          <div className="absolute bottom-8 flex flex-col items-center gap-1.5 z-20">
            <button
              onClick={() => setZoomState('india')}
              className="px-5 py-2 rounded bg-tealAccent hover:bg-tealAccent/90 text-bgDark font-bold text-xs tracking-wider uppercase shadow-lg transition-all duration-200"
            >
              EXPLORE RISK MAP
            </button>
            <span className="text-[8px] text-textMuted tracking-wider font-semibold uppercase">Click to render national map</span>
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
            className="w-full h-full max-h-[500px] aspect-square transition-all duration-500 ease-in-out"
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
                        className="transition-all duration-200 group-hover:brightness-110"
                      />
                    ))}
                  </g>
                );
              })}
            </g>

            <defs>
              <radialGradient id="neSaffronGlowMap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF9F43" stopOpacity="0.12" />
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
              className="absolute pointer-events-none z-30 bg-[#0B2030] border border-white/10 rounded px-2.5 py-1.5 text-[10px] flex flex-col gap-0.5 shadow-2xl"
              style={{ 
                left: `${hoverPos.x + 15}px`, 
                top: `${hoverPos.y - 45}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="font-bold text-textWhite flex items-center gap-1.5">
                <span>{hoveredState.name}</span>
                {isNEState(hoveredState.name) && (
                  <span className="bg-saffronAccent/15 text-saffronAccent text-[8px] px-1.5 rounded-full font-bold">NE</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: getRiskColor(profile.riskLevel) }}
                />
                <span className="text-textMuted uppercase text-[8px] font-bold tracking-wider">
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

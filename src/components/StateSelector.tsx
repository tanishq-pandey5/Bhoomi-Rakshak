import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { allStatesList } from '../data/mockData';

interface StateSelectorProps {
  selectedState: string;
  onSelectState: (stateName: string) => void;
  regionFilter: string;
  onSelectRegion: (region: string) => void;
}

export const StateSelector: React.FC<StateSelectorProps> = ({
  selectedState,
  onSelectState,
  regionFilter,
  onSelectRegion
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const neStates = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];

  // Filter states based on search query
  const filteredStates = allStatesList.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectState = (state: string) => {
    onSelectState(state);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col gap-5 w-full py-1">
      {/* Title */}
      <div>
        <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
          OPERATIONAL BOUNDARIES
        </span>
        <h3 className="text-base font-extrabold text-textWhite uppercase tracking-wide">
          Region Control
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
        
        {/* Left column: Selected State dropdown & Area Context */}
        <div className="flex flex-col gap-4">
          
          {/* Dropdown Selector */}
          <div ref={dropdownRef} className="relative w-full">
            <span className="block text-[9px] text-textMuted uppercase font-bold tracking-wider mb-1.5">
              Region / State
            </span>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-9 px-3 flex items-center justify-between rounded bg-[#0B2030] border border-white/8 hover:border-tealAccent/30 text-xs font-bold text-textWhite transition-colors duration-200"
            >
              <span>{selectedState || 'Select region...'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-textMuted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute left-0 right-0 mt-1.5 z-40 bg-[#0B2030] border border-white/10 rounded p-2 shadow-2xl max-h-56 flex flex-col">
                <div className="relative mb-2 shrink-0">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-textMuted" />
                  <input
                    type="text"
                    placeholder="Search state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded bg-[#061521] border border-white/8 text-xs text-textWhite placeholder:text-textMuted focus:outline-none focus:border-tealAccent transition-colors"
                  />
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {filteredStates.length > 0 ? (
                    filteredStates.map((state) => {
                      const isSelected = selectedState === state;
                      return (
                        <button
                          key={state}
                          onClick={() => handleSelectState(state)}
                          className={`w-full px-2.5 py-1.5 flex items-center justify-between text-left text-xs rounded transition-colors duration-150 ${
                            isSelected 
                              ? 'bg-tealAccent/10 text-tealAccent font-bold' 
                              : 'text-textMuted hover:bg-white/5 hover:text-textWhite'
                          }`}
                        >
                          <span>{state}</span>
                          {isSelected && <Check className="w-3 h-3 text-tealAccent" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs py-3 text-textMuted">No regions found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Area Filter Tabs */}
          <div>
            <span className="block text-[9px] text-textMuted uppercase font-bold tracking-wider mb-1.5">
              Area Context
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'All India', value: 'All India' },
                { label: 'North-East', value: 'North-East India' },
                { label: 'Himalayan', value: 'Himalayan Region' }
              ].map(region => {
                const isAct = regionFilter === region.value;
                return (
                  <button
                    key={region.value}
                    onClick={() => onSelectRegion(region.value)}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold rounded transition-colors ${
                      isAct 
                        ? 'bg-tealAccent text-bgDark font-black' 
                        : 'bg-[#0B2030] text-textMuted hover:text-textWhite'
                    }`}
                  >
                    {region.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: NE Quick select grid */}
        <div>
          <span className="block text-[9px] text-textMuted uppercase font-bold tracking-wider mb-1.5">
            Quick Select (North-East)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {neStates.map(state => {
              const isSel = selectedState === state;
              return (
                <button
                  key={state}
                  onClick={() => onSelectState(state)}
                  className={`px-2 py-1.5 text-[9px] font-bold rounded text-left transition-colors ${
                    isSel 
                      ? 'bg-tealAccent/15 border border-tealAccent/25 text-tealAccent' 
                      : 'bg-white/5 text-textMuted hover:bg-white/8 hover:text-textWhite'
                  }`}
                >
                  {state}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

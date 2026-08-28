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

  const neStates = ["Meghalaya", "Sikkim", "Assam", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura"];

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
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* State Dropdown Search */}
        <div ref={dropdownRef} className="relative w-full md:w-72">
          <label className="block text-[10px] text-textMuted uppercase font-bold tracking-wider mb-1">
            Select Monitored State
          </label>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-10 px-4 flex items-center justify-between rounded-lg bg-panelBg border border-white/8 hover:border-tealAccent/30 text-sm font-semibold text-textWhite transition-all duration-200"
          >
            <span>{selectedState || 'Search and select...'}</span>
            <ChevronDown className={`w-4 h-4 text-textMuted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 z-40 glass-panel border-white/20 p-2 shadow-2xl max-h-64 flex flex-col">
              <div className="relative mb-2 shrink-0">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-textMuted" />
                <input
                  type="text"
                  placeholder="Type state name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-bgDark border border-white/10 text-xs text-textWhite placeholder:text-textMuted focus:outline-none focus:border-tealAccent transition-colors"
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
                        className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs rounded-lg transition-colors duration-150 ${
                          isSelected 
                            ? 'bg-tealAccent/15 text-tealAccent font-semibold' 
                            : 'text-textMuted hover:bg-white/5 hover:text-textWhite'
                        }`}
                      >
                        <span>{state}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-tealAccent" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center text-xs py-4 text-textMuted">No states found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="block text-[10px] text-textMuted uppercase font-bold tracking-wider w-full md:w-auto md:mr-1">
            Region Filter
          </span>
          {[
            { label: 'All India', value: 'All India' },
            { label: 'North-East', value: 'North-East India' },
            { label: 'Himalayan', value: 'Himalayan Region' },
            { label: 'Others', value: 'Other Regions' }
          ].map(region => {
            const isAct = regionFilter === region.value;
            return (
              <button
                key={region.value}
                onClick={() => onSelectRegion(region.value)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                  isAct 
                    ? 'bg-tealAccent text-bgDark border-tealAccent shadow-lg shadow-tealAccent/10' 
                    : 'bg-panelBg border-white/10 text-textMuted hover:text-textWhite hover:border-white/20'
                }`}
              >
                {region.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* NE Quick Select buttons */}
      <div className="p-4 glass-panel border-white/8 bg-panelBg/40">
        <span className="block text-[10px] text-textMuted uppercase font-semibold tracking-wider mb-2.5">
          North-Eastern Region Quick Selection
        </span>
        <div className="flex flex-wrap gap-2">
          {neStates.map(state => {
            const isSel = selectedState === state;
            return (
              <button
                key={state}
                onClick={() => onSelectState(state)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isSel 
                    ? 'bg-saffronAccent text-bgDark font-bold shadow-sm' 
                    : 'bg-white/5 border border-white/8 text-textMuted hover:bg-white/8 hover:text-textWhite'
                }`}
              >
                {state}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

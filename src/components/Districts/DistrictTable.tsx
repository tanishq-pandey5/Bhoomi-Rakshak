import React, { useState } from 'react';
import { mockStatesData, getFullStateProfile, getRiskColor } from '../../data/mockData';
import type { DistrictRisk } from '../../data/mockData';
import { Search } from 'lucide-react';

interface DistrictRow {
  rank: number;
  districtName: string;
  stateName: string;
  riskScore: number;
  riskLevel: DistrictRisk['riskLevel'];
  mainDriver: string;
  alertStatus: DistrictRisk['alertStatus'];
}

interface DistrictTableProps {
  onSelectState: (stateName: string) => void;
  selectedState: string;
}

export const DistrictTable: React.FC<DistrictTableProps> = ({ onSelectState, selectedState }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Gather districts from all pre-loaded states
  const allDistricts: DistrictRow[] = React.useMemo(() => {
    let list: { district: DistrictRisk; stateName: string }[] = [];
    
    // Extract from mock states
    Object.keys(mockStatesData).forEach(stateName => {
      const state = mockStatesData[stateName];
      state.districts.forEach(d => {
        list.push({ district: d, stateName });
      });
    });

    // Extract from some fallback states to make the list rich
    const richFallbackStates = ["Kerala", "Maharashtra", "Uttarakhand", "Himachal Pradesh", "Jammu and Kashmir"];
    richFallbackStates.forEach(stateName => {
      if (!mockStatesData[stateName]) {
        const state = getFullStateProfile(stateName);
        state.districts.forEach(d => {
          list.push({ district: d, stateName });
        });
      }
    });

    // Sort by riskScore descending
    const sortedList = list.sort((a, b) => b.district.riskScore - a.district.riskScore);

    // Map to row structure with rank
    return sortedList.map((item, index) => ({
      rank: index + 1,
      districtName: item.district.name,
      stateName: item.stateName,
      riskScore: item.district.riskScore,
      riskLevel: item.district.riskLevel,
      mainDriver: item.district.mainDriver,
      alertStatus: item.district.alertStatus
    }));
  }, []);

  // Filter districts based on search query
  const filteredRows = allDistricts.filter(row =>
    row.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.mainDriver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (stateName: string) => {
    onSelectState(stateName);
  };

  const getAlertBadgeStyles = (status: DistrictRow['alertStatus']) => {
    switch (status) {
      case 'Active': return 'bg-riskCritical/10 text-riskVeryHigh border-riskCritical/20';
      case 'Monitoring': return 'bg-saffronAccent/10 text-saffronAccent border-saffronAccent/20';
      default: return 'bg-riskVeryLow/10 text-riskVeryLow border-riskVeryLow/20';
    }
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full gap-4">
      
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-wide text-textWhite">Most Vulnerable Districts</h3>
          <p className="text-xs text-textMuted mt-0.5 font-sans">National ranking based on current telemetry inputs</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search district/state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-bgDark border border-white/8 text-xs text-textWhite placeholder:text-textMuted focus:outline-none focus:border-tealAccent transition-colors"
          />
        </div>
      </div>

      {/* Responsive Displays */}
      <div className="flex-1 overflow-x-auto min-h-[300px] max-h-[480px] custom-scrollbar pr-1">
        
        {/* DESKTOP TABLE VIEW */}
        <table className="hidden md:table w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 text-textMuted uppercase font-bold tracking-wider">
              <th className="py-3 px-2 w-12 text-center">Rank</th>
              <th className="py-3 px-3">District</th>
              <th className="py-3 px-3">State</th>
              <th className="py-3 px-3 text-center">Risk Score</th>
              <th className="py-3 px-3">Grade</th>
              <th className="py-3 px-3">Primary Trigger</th>
              <th className="py-3 px-3 text-center">Alert</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map(row => {
                const isSelected = selectedState === row.stateName;
                const riskColor = getRiskColor(row.riskLevel);
                
                return (
                  <tr
                    key={`${row.stateName}-${row.districtName}`}
                    onClick={() => handleRowClick(row.stateName)}
                    className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors duration-150 ${
                      isSelected ? 'bg-tealAccent/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-2 text-center text-textMuted font-mono">#{row.rank}</td>
                    <td className="py-3 px-3 font-semibold text-textWhite">{row.districtName}</td>
                    <td className="py-3 px-3 text-textMuted">{row.stateName}</td>
                    <td className="py-3 px-3 text-center font-bold text-textWhite font-mono">{row.riskScore}%</td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5" style={{ color: riskColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor }} />
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-textMuted">{row.mainDriver}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getAlertBadgeStyles(row.alertStatus)}`}>
                        {row.alertStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-textMuted">No districts found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* MOBILE STACKED CARDS VIEW */}
        <div className="md:hidden flex flex-col gap-3">
          {filteredRows.length > 0 ? (
            filteredRows.map(row => {
              const isSelected = selectedState === row.stateName;
              const riskColor = getRiskColor(row.riskLevel);

              return (
                <div
                  key={`${row.stateName}-${row.districtName}-mob`}
                  onClick={() => handleRowClick(row.stateName)}
                  className={`p-3.5 rounded-lg border flex flex-row gap-4 items-center transition-all duration-150 cursor-pointer ${
                    isSelected 
                      ? 'bg-tealAccent/5 border-tealAccent/30' 
                      : 'bg-white/5 border-white/8 hover:bg-white/8'
                  }`}
                >
                  {/* Left: Square Index / telemetry badge */}
                  <div className="w-16 h-16 shrink-0 rounded-lg bg-bgDark border border-white/8 flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="text-[10px] text-textMuted uppercase font-semibold">Rank</span>
                    <span className="text-sm font-bold text-textWhite font-mono mt-0.5">#{row.rank}</span>
                  </div>

                  {/* Right: Details block */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-textWhite">{row.districtName}</h4>
                      <span className={`px-1.5 py-0.5 rounded border text-[8px] font-bold uppercase ${getAlertBadgeStyles(row.alertStatus)}`}>
                        {row.alertStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-[10px] text-textMuted mt-0.5">
                      <span>{row.stateName}</span>
                      <span className="font-bold font-mono" style={{ color: riskColor }}>
                        {row.riskScore}% Risk
                      </span>
                    </div>

                    {/* Pill Action Button */}
                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/5">
                      <span className="text-[9px] text-textMuted block">Trigger: {row.mainDriver}</span>
                      <button className="px-3 py-0.5 rounded text-[9px] font-bold bg-textWhite text-bgDark hover:bg-textWhite/90 transition-colors">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-textMuted text-xs">No districts found</div>
          )}
        </div>

      </div>

    </div>
  );
};

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
      case 'Active': return 'text-riskCritical bg-riskCritical/10 border-riskCritical/20';
      case 'Monitoring': return 'text-saffronAccent bg-saffronAccent/10 border-saffronAccent/20';
      default: return 'text-riskVeryLow bg-riskVeryLow/10 border-riskVeryLow/20';
    }
  };

  return (
    <div className="flex flex-col h-full gap-5">
      
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
            Vulnerability Rank
          </span>
          <h3 className="text-base font-extrabold text-textWhite uppercase tracking-wide">
            Regional Threat Roster
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-textMuted" />
          <input
            type="text"
            placeholder="Search district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded bg-[#0B2030] border border-white/8 text-xs text-textWhite placeholder:text-textMuted focus:outline-none focus:border-tealAccent transition-colors"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="flex-1 overflow-x-auto min-h-[300px] max-h-[460px] custom-scrollbar pr-1">
        
        {/* DESKTOP TABLE VIEW */}
        <table className="hidden md:table w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/8 text-textMuted uppercase font-bold tracking-wider">
              <th className="py-2.5 px-2 w-12 text-center text-[9px]">Rank</th>
              <th className="py-2.5 px-3 text-[9px]">District</th>
              <th className="py-2.5 px-3 text-[9px]">State</th>
              <th className="py-2.5 px-3 text-center text-[9px]">Risk Score</th>
              <th className="py-2.5 px-3 text-[9px]">Hazard Grade</th>
              <th className="py-2.5 px-3 text-[9px]">Primary Trigger</th>
              <th className="py-2.5 px-3 text-center text-[9px]">Alert</th>
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
                    className={`border-b border-white/5 hover:bg-white/2 cursor-pointer transition-colors duration-150 ${
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
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border border-white/5 ${getAlertBadgeStyles(row.alertStatus)}`}>
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

        {/* MOBILE VIEW */}
        <div className="md:hidden flex flex-col gap-2.5">
          {filteredRows.length > 0 ? (
            filteredRows.map(row => {
              const isSelected = selectedState === row.stateName;
              const riskColor = getRiskColor(row.riskLevel);

              return (
                <div
                  key={`${row.stateName}-${row.districtName}-mob`}
                  onClick={() => handleRowClick(row.stateName)}
                  className={`p-3.5 rounded border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-tealAccent/5 border-tealAccent/30' 
                      : 'bg-white/3 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-textMuted font-mono">#{row.rank}</span>
                      <h4 className="text-xs font-bold text-textWhite">{row.districtName}</h4>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${getAlertBadgeStyles(row.alertStatus)}`}>
                      {row.alertStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-[10px] text-textMuted mt-1">
                    <span>{row.stateName}</span>
                    <span className="font-bold font-mono" style={{ color: riskColor }}>
                      {row.riskScore}% Risk
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5 text-[9px] text-textMuted">
                    <span>Trigger: {row.mainDriver}</span>
                    <span className="text-tealAccent font-bold">Select State →</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-textMuted text-xs font-semibold">No districts found</div>
          )}
        </div>

      </div>

    </div>
  );
};

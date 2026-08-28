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
      case 'Active': return 'text-[#FF4D5A] bg-[#FF4D5A]/10';
      case 'Monitoring': return 'text-[#F5C451] bg-[#F5C451]/10';
      default: return 'text-[#32D583] bg-[#32D583]/10';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-4">
      
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
            Regional Threat Roster
          </span>
          <h3 className="text-2xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
            Most Vulnerable Districts
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#71839C]" />
          <input
            type="text"
            placeholder="Search district/state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-[#081830]/40 border border-white/5 text-xs text-[#F5F7FB] placeholder-[#71839C] focus:outline-none focus:border-[#29A9FF]/30 transition-colors"
          />
        </div>
      </div>

      {/* Responsive Displays */}
      <div className="flex-1 overflow-x-auto min-h-[300px] max-h-[440px] pr-1">
        
        {/* DESKTOP TABLE VIEW */}
        <table className="hidden md:table w-full text-left border-collapse text-xs select-none">
          <thead>
            <tr className="border-b border-white/5 text-[#71839C] uppercase font-bold tracking-widest text-[9px]">
              <th className="py-3 px-2 w-16 text-center">Rank</th>
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
                    className={`border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors duration-150 ${
                      isSelected ? 'bg-[#29A9FF]/5' : ''
                    }`}
                  >
                    <td className="py-4 px-2 text-center text-[#71839C] font-mono">#{row.rank}</td>
                    <td className="py-4 px-3 font-semibold text-[#F5F7FB]">{row.districtName}</td>
                    <td className="py-4 px-3 text-[#A7B6CC]">{row.stateName}</td>
                    <td className="py-4 px-3 text-center font-bold text-[#F5F7FB] font-mono">{row.riskScore}%</td>
                    <td className="py-4 px-3">
                      <span className="flex items-center gap-2" style={{ color: riskColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor }} />
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-[#A7B6CC]">{row.mainDriver}</td>
                    <td className="py-4 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getAlertBadgeStyles(row.alertStatus)}`}>
                        {row.alertStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#71839C]">No districts found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* MOBILE STACKED CARDS VIEW */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredRows.length > 0 ? (
            filteredRows.map(row => {
              const isSelected = selectedState === row.stateName;
              const riskColor = getRiskColor(row.riskLevel);

              return (
                <div
                  key={`${row.stateName}-${row.districtName}-mob`}
                  onClick={() => handleRowClick(row.stateName)}
                  className={`p-4 rounded-xl border flex flex-row gap-4 items-center transition-all duration-150 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#29A9FF]/5 border-[#29A9FF]/30' 
                      : 'bg-white/3 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="w-14 h-14 shrink-0 rounded-lg bg-[#08264A]/30 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="text-[9px] text-[#71839C] uppercase font-bold">Rank</span>
                    <span className="text-xs font-bold text-[#F5F7FB] font-mono mt-0.5">#{row.rank}</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#F5F7FB]">{row.districtName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase ${getAlertBadgeStyles(row.alertStatus)}`}>
                        {row.alertStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-[10px] text-[#A7B6CC] mt-0.5">
                      <span>{row.stateName}</span>
                      <span className="font-bold font-mono" style={{ color: riskColor }}>
                        {row.riskScore}% Risk
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/5">
                      <span className="text-[8px] text-[#71839C] block">Trigger: {row.mainDriver}</span>
                      <button className="px-3 py-0.5 rounded-full text-[8px] font-bold bg-[#F5F7FB] text-[#030B1C] hover:bg-white/90 transition-colors">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-[#71839C] text-xs">No districts found</div>
          )}
        </div>

      </div>

    </div>
  );
};

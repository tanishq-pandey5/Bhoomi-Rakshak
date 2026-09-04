import React, { useState } from 'react';
import { liveAlertsData } from '../../data/mockData';
import type { SystemAlert } from '../../data/mockData';

interface AlertsListProps {
  onSelectState: (stateName: string) => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({ onSelectState }) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Monitoring'>('All');

  // Filter alerts
  const filteredAlerts = liveAlertsData.filter(alert => {
    if (statusFilter === 'All') return true;
    return alert.status === statusFilter;
  });

  const getSeverityColor = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'Critical': return '#B91C1C';
      case 'High': return '#FF8A3D';
      case 'Moderate': return '#F5C451';
      default: return '#32D583';
    }
  };

  const handleAlertClick = (location: string) => {
    const stateName = location.split(',')[1]?.trim();
    if (stateName) {
      onSelectState(stateName);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#71839C] uppercase font-bold tracking-widest block">
            System Warnings
          </span>
          <h3 className="text-xl font-bold uppercase tracking-wider text-[#F5F7FB] mt-1">
            Live Alerts
          </h3>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['All', 'Active', 'Monitoring'] as const).map(status => {
            const isAct = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full border transition-all duration-200 ${
                  isAct 
                    ? 'bg-[#29A9FF]/10 border-[#29A9FF]/30 text-[#29A9FF]' 
                    : 'bg-white/5 border-white/5 text-[#A7B6CC] hover:text-[#F5F7FB]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 flex flex-col gap-6 select-none mt-2">
        {/* Continuous vertical timeline line */}
        <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/5" />

        {filteredAlerts.length > 0 ? (
          filteredAlerts.slice(0, 3).map(alert => {
            const color = getSeverityColor(alert.severity);
            const isCritical = alert.severity === 'Critical' || alert.severity === 'High';
            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert.location)}
                className="relative flex gap-4 cursor-pointer group"
              >
                {/* Left Node element centered on the line */}
                <div className="absolute left-[-26px] top-1.5 flex items-center justify-center w-6 h-6 z-10">
                  <div 
                    className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                  />
                </div>

                {/* Alert details */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color }}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[11px] font-bold text-[#F5F7FB]">
                      {alert.location}
                    </span>
                    <span className="text-[10px] text-[#71839C] ml-auto font-mono">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#A7B6CC] leading-relaxed group-hover:text-[#F5F7FB] transition-colors">
                    {alert.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-xs py-6 text-[#71839C]">No warning events reported.</div>
        )}
      </div>

    </div>
  );
};

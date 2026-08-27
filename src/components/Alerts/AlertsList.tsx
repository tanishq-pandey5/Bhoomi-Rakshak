import React, { useState } from 'react';
import { liveAlertsData } from '../../data/mockData';
import type { SystemAlert } from '../../data/mockData';
import { ShieldAlert, Info } from 'lucide-react';

interface AlertsListProps {
  onSelectState: (stateName: string) => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({ onSelectState }) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Monitoring' | 'Resolved'>('All');

  // Filter alerts
  const filteredAlerts = liveAlertsData.filter(alert => {
    if (statusFilter === 'All') return true;
    return alert.status === statusFilter;
  });

  const getSeverityColor = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'Critical': return 'var(--risk-red)';
      case 'High': return 'var(--risk-orange)';
      case 'Moderate': return 'var(--saffron)';
      default: return 'var(--teal)';
    }
  };

  const handleAlertClick = (location: string) => {
    // Location is e.g. "East Khasi Hills, Meghalaya"
    const stateName = location.split(',')[1]?.trim();
    if (stateName) {
      onSelectState(stateName);
    }
  };

  return (
    <div className="flex flex-col h-full gap-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <span className="text-[9px] tracking-widest text-tealAccent font-bold uppercase block mb-1">
            Emergency Dispatch
          </span>
          <h3 className="text-base font-extrabold text-textWhite uppercase tracking-wide">
            Active Incident Feed
          </h3>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1">
          {(['All', 'Active', 'Monitoring', 'Resolved'] as const).map(status => {
            const isAct = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold rounded transition-colors ${
                  isAct 
                    ? 'bg-tealAccent text-bgDark' 
                    : 'bg-[#0B2030] text-textMuted hover:text-textWhite'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Incident List Stream */}
      <div className="flex-1 overflow-y-auto max-h-[460px] pr-1 flex flex-col gap-0.5 custom-scrollbar">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => {
            const color = getSeverityColor(alert.severity);
            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert.location)}
                className="py-3 border-b border-white/5 cursor-pointer hover:bg-white/2 transition-colors duration-150 pl-3 relative"
              >
                {/* Left side color accent border indicator */}
                <div 
                  className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r" 
                  style={{ backgroundColor: color }}
                />

                <div className="flex flex-col gap-1.5">
                  
                  {/* Alert Header Line */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-textWhite">{alert.location}</span>
                      <span className="text-[8px] tracking-wider uppercase font-extrabold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}12`, color: color, border: `1px solid ${color}25` }}>
                        {alert.severity}
                      </span>
                    </div>
                    <span className="text-[9px] text-textMuted font-mono">{alert.timestamp}</span>
                  </div>

                  {/* Message Reason */}
                  <p className="text-[11px] text-textMuted leading-relaxed">
                    {alert.message}
                  </p>

                  {/* Recommendation Protocol */}
                  <div className="text-[10px] text-textWhite leading-relaxed font-semibold flex gap-1.5 mt-0.5 items-start">
                    <span className="text-saffronAccent uppercase text-[9px] tracking-wider shrink-0 mt-0.5">PROTOCOL:</span>
                    <span>{alert.action}</span>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center justify-between text-[9px] text-textMuted mt-1">
                    <span>
                      Status: <strong className="font-semibold text-textWhite uppercase">{alert.status}</strong>
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-tealAccent font-bold">
                      Zoom To Region →
                    </span>
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Info className="w-8 h-8 text-textMuted opacity-45 mb-2" />
            <p className="text-sm font-semibold text-textWhite uppercase tracking-wide">No incident logs found</p>
            <p className="text-xs text-textMuted mt-0.5">There are no reports matching the active filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

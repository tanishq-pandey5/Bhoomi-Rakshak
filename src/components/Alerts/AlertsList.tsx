import React, { useState } from 'react';
import { liveAlertsData } from '../../data/mockData';
import type { SystemAlert } from '../../data/mockData';
import { Bell, Info } from 'lucide-react';

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
      case 'Critical': return '#991B1B';
      case 'High': return '#EF4444';
      case 'Moderate': return '#FACC15';
      default: return '#16B8A6';
    }
  };

  const getSeverityBadge = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'Critical': return 'bg-riskCritical/10 text-riskVeryHigh border-riskCritical/20';
      case 'High': return 'bg-riskHigh/10 text-riskHigh border-riskHigh/20';
      case 'Moderate': return 'bg-riskModerate/10 text-riskModerate border-riskModerate/20';
      default: return 'bg-tealAccent/10 text-tealAccent border-tealAccent/20';
    }
  };

  const handleAlertClick = (location: string) => {
    const stateName = location.split(',')[1]?.trim();
    if (stateName) {
      onSelectState(stateName);
    }
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full gap-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-riskVeryHigh/15 border border-riskVeryHigh/20 text-riskVeryHigh animate-pulse">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-[#8FA6B8] uppercase font-bold tracking-widest block mb-0.5">
              Live Warnings Stream
            </span>
            <h3 className="text-base font-extrabold tracking-wide text-textWhite uppercase">
              Threat & Warning Broadcast
            </h3>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Active', 'Monitoring', 'Resolved'] as const).map(status => {
            const isAct = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs font-semibold rounded border transition-all duration-200 ${
                  isAct 
                    ? 'bg-tealAccent/15 border-tealAccent text-tealAccent' 
                    : 'bg-white/5 border-white/8 text-textMuted hover:text-textWhite'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto max-h-[440px] pr-1 flex flex-col gap-5 relative custom-scrollbar pl-4">
        {/* Continuous vertical timeline line */}
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-white/5" />

        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => {
            const color = getSeverityColor(alert.severity);
            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert.location)}
                className="relative flex gap-4 cursor-pointer group select-none"
              >
                {/* Left Node element centered on the line */}
                <div className="relative flex items-center justify-center w-7 h-7 shrink-0 z-10">
                  <div className="w-5 h-5 rounded-full bg-bgDark border border-white/10 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                  {alert.status === 'Active' && (
                    <span 
                      className="absolute inset-0.5 rounded-full animate-ping opacity-20" 
                      style={{ backgroundColor: color }} 
                    />
                  )}
                </div>

                {/* Right content area */}
                <div className="flex-1 flex flex-col gap-1.5 pb-4 border-b border-white/5">
                  {/* Alert Header */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-textWhite hover:text-tealAccent transition-colors">
                        {alert.location}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[7px] font-extrabold uppercase border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <span className="text-[10px] text-textMuted font-mono">
                      {alert.timestamp}
                    </span>
                  </div>

                  {/* Body Message */}
                  <p className="text-[11px] text-textMuted leading-relaxed">
                    {alert.message}
                  </p>

                  {/* Recommended Protocol */}
                  <div className="text-[10px] text-textWhite leading-relaxed bg-white/2 border border-white/5 px-2.5 py-1.5 rounded">
                    <strong className="text-saffronAccent font-bold uppercase text-[9px] tracking-wide block mb-0.5">
                      Response Protocol:
                    </strong>
                    <span className="text-[#8FA6B8]">{alert.action}</span>
                  </div>

                  {/* Footer status link */}
                  <div className="flex items-center justify-between text-[10px] text-textMuted mt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>Status: <strong className="font-bold text-textWhite uppercase text-[8px]">{alert.status}</strong></span>
                    </span>
                    <span className="text-tealAccent font-bold text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Inspect telemetry →
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Info className="w-8 h-8 text-textMuted opacity-40 mb-2" />
            <p className="text-sm font-semibold text-textWhite">No warnings logged</p>
            <p className="text-xs text-textMuted mt-1">No alerts matching active filters were found.</p>
          </div>
        )}
      </div>

    </div>
  );
};

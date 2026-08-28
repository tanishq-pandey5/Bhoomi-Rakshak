import React, { useState } from 'react';
import { liveAlertsData } from '../../data/mockData';
import type { SystemAlert } from '../../data/mockData';
import { Bell, ShieldAlert, Info } from 'lucide-react';

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

  // Get alert border color
  const getAlertBorderColor = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'Critical': return 'border-l-riskCritical';
      case 'High': return 'border-l-riskHigh';
      case 'Moderate': return 'border-l-riskModerate';
      default: return 'border-l-tealAccent';
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
    // Location is e.g. "East Khasi Hills, Meghalaya"
    const stateName = location.split(',')[1]?.trim();
    if (stateName) {
      onSelectState(stateName);
    }
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full gap-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-riskVeryHigh/15 border border-riskVeryHigh/20 text-riskVeryHigh animate-pulse">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wide text-textWhite">Live Threat & Warning Broadcast</h3>
            <p className="text-xs text-textMuted mt-0.5">Real-time localized regional warnings</p>
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

      {/* Alerts Stream */}
      <div className="flex-1 overflow-y-auto max-h-[440px] pr-1 flex flex-col gap-3 custom-scrollbar">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => {
            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert.location)}
                className={`glass-panel p-4 flex flex-col sm:flex-row gap-4 cursor-pointer border-l-4 transition-all duration-200 hover:bg-white/5 ${getAlertBorderColor(alert.severity)}`}
              >
                {/* Left Telemetry circular/square graphic */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-bgDark border border-white/8 flex items-center justify-center relative overflow-hidden">
                  <div className={`absolute inset-1 rounded-full border border-dashed animate-spin ${
                    alert.severity === 'Critical' ? 'border-riskCritical/40' :
                    alert.severity === 'High' ? 'border-riskHigh/40' :
                    alert.severity === 'Moderate' ? 'border-riskModerate/40' : 'border-tealAccent/40'
                  }`} style={{ animationDuration: '12s' }} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.severity === 'Critical' ? 'bg-riskCritical/20 text-riskVeryHigh' :
                    alert.severity === 'High' ? 'bg-riskHigh/20 text-riskHigh' :
                    alert.severity === 'Moderate' ? 'bg-riskModerate/20 text-riskModerate' : 'bg-tealAccent/20 text-tealAccent'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>

                {/* Right content area */}
                <div className="flex-1 flex flex-col justify-between gap-2">
                  <div>
                    {/* Alert Top Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-bold text-textWhite">
                          {alert.location}
                        </span>
                      </div>
                      <span className="text-[10px] text-textMuted font-mono">
                        {alert.timestamp}
                      </span>
                    </div>

                    {/* Body Message */}
                    <p className="text-[11px] text-textMuted leading-relaxed mt-1">
                      {alert.message}
                    </p>

                    {/* Recommended Protocol */}
                    <p className="text-[10px] text-textWhite leading-relaxed mt-1 font-medium bg-white/5 border border-white/8 px-2 py-1 rounded">
                      <strong className="text-saffronAccent">Protocol: </strong>{alert.action}
                    </p>
                  </div>

                  {/* Action footer */}
                  <div className="flex items-center justify-between text-[10px] text-textMuted mt-1">
                    <span className="flex items-center gap-1">
                      Status: <strong className={`font-semibold ${
                        alert.status === 'Active' ? 'text-riskVeryHigh' :
                        alert.status === 'Monitoring' ? 'text-saffronAccent' : 'text-riskVeryLow'
                      }`}>{alert.status}</strong>
                    </span>
                    <button className="px-3 py-1 rounded text-[10px] font-bold bg-textWhite text-bgDark hover:bg-textWhite/90 transition-all duration-150">
                      View details
                    </button>
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

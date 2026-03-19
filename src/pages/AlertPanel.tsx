import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, X, ArrowUpCircle, Brain, Shield, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { employees } from '@/data/mockData';

const severityBadgeClass: Record<string, string> = {
  Critical: 'badge-critical',
  Urgent: 'badge-urgent',
  Investigate: 'badge-investigate',
  Monitor: 'badge-monitor',
  Escalated: 'badge-escalated',
};

const severityBorderColor: Record<string, string> = {
  Critical: '#E8201A',
  Urgent: '#F59E0B',
  Investigate: '#1E5BB5',
  Monitor: '#8BA3C7',
};

export default function AlertPanel() {
  const { alerts, dismissAlert, escalateAlert } = useAppContext();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  const [escalatedIds, setEscalatedIds] = useState<Set<string>>(new Set());

  const severityCounts = {
    Critical: alerts.filter(a => a.severity === 'Critical').length,
    Urgent: alerts.filter(a => a.severity === 'Urgent').length,
    Investigate: alerts.filter(a => a.severity === 'Investigate').length,
    Monitor: alerts.filter(a => a.severity === 'Monitor').length,
  };

  const handleDismiss = (id: string) => {
    setFadingOut(id);
    setTimeout(() => {
      dismissAlert(id);
      setFadingOut(null);
    }, 300);
  };

  const handleEscalate = (id: string) => {
    escalateAlert(id);
    setEscalatedIds(prev => new Set(prev).add(id));
  };

  const modalAlert = showModal ? alerts.find(a => a.id === showModal) : null;
  const modalEmp = modalAlert ? employees.find(e => e.id === modalAlert.employeeId) : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {Object.entries(severityCounts).map(([sev, count]) => (
          <div key={sev} className={`text-sm font-semibold ${severityBadgeClass[sev]}`}>
            {sev}: {count}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {alerts.map((alert, idx) => {
          const emp = employees.find(e => e.id === alert.employeeId);
          const isExpanded = expanded === alert.id;
          const isFading = fadingOut === alert.id;
          const isEscalated = alert.status === 'Escalated' || escalatedIds.has(alert.id);
          const displaySeverity = isEscalated ? 'Escalated' : alert.severity;
          const borderColor = severityBorderColor[alert.severity] || '#8BA3C7';

          return (
            <div
              key={alert.id}
              className={`glass-card overflow-hidden transition-all duration-300 animate-fade-in-up ${isFading ? 'opacity-0 scale-95' : 'opacity-100'} ${alert.severity === 'Critical' ? 'shimmer-critical' : ''}`}
              style={{
                borderLeft: `3px solid ${borderColor}`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), -3px 0 8px ${borderColor}33`,
                animationDelay: `${idx * 0.05}s`,
                background: alert.severity === 'Critical' ? 'rgba(232,32,26,0.04)' : undefined,
              }}
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 hover:-translate-y-[1px]"
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
              >
                <span className={`text-xs font-bold transition-all duration-500 ${severityBadgeClass[displaySeverity]}`}>
                  {displaySeverity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{emp?.name || 'Unknown'} — {emp?.role || ''}</p>
                  <p className="text-xs text-muted-foreground truncate">{alert.triggerReason}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t animate-in slide-in-from-top-2 duration-200" style={{ borderColor: 'rgba(30,91,181,0.08)', boxShadow: 'inset 0 1px 12px rgba(30,91,181,0.05)' }}>
                  <div className="mt-3 mb-4 space-y-3">
                    <p className="text-sm text-foreground font-medium">{alert.triggerReason}</p>
                    <div className="glass-inner p-3 space-y-2">
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Shield className="h-3 w-3 text-primary" /> Anomaly Details
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Employee:</span>
                          <span className="text-foreground font-medium">{emp?.name} ({emp?.role})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Department:</span>
                          <span className="text-foreground">{emp?.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Risk Score:</span>
                          <span className={`font-bold ${(emp?.riskScore || 0) > 70 ? 'text-destructive' : (emp?.riskScore || 0) > 30 ? 'text-warning' : 'text-success'}`}>{emp?.riskScore}/100</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Anomalies Detected:</span>
                          <span className="text-foreground font-medium">{emp?.anomaliesDetected}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Triggered:</span>
                          <span className="text-foreground">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowModal(alert.id); }}
                      className="flex items-center gap-1.5 btn-primary text-white px-3 py-1.5 text-xs font-medium"
                    >
                      <Brain className="h-3 w-3" /> AI Explanation
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEscalate(alert.id); }}
                      disabled={isEscalated}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium disabled:opacity-50 transition-all duration-200"
                      style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, color: '#F59E0B' }}
                    >
                      <ArrowUpCircle className="h-3 w-3" /> {isEscalated ? 'Escalated' : 'Escalate'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDismiss(alert.id); }}
                      className="flex items-center gap-1.5 btn-ghost text-muted-foreground px-3 py-1.5 text-xs font-medium"
                    >
                      <X className="h-3 w-3" /> Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No active alerts</p>
          </div>
        )}
      </div>

      {/* AI Explanation Modal */}
      {modalAlert && modalEmp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className="glass-modal max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">AI Explanation</h3>
              </div>
              <button onClick={() => setShowModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 glass-inner">
              <div className="w-10 h-10 rounded-full avatar-gradient-1 flex items-center justify-center text-sm font-bold text-white" style={{ boxShadow: '0 0 0 2px rgba(30,91,181,0.5)' }}>
                {modalEmp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{modalEmp.name}</p>
                <p className="text-xs text-muted-foreground">{modalEmp.role} • Risk Score: {modalEmp.riskScore}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-1">What Was Detected</h4>
                <p className="text-muted-foreground">{modalAlert.aiExplanation.whatDetected}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Why It Is Suspicious</h4>
                <p className="text-muted-foreground">{modalAlert.aiExplanation.whySuspicious}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Contributing Factors</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {modalAlert.aiExplanation.contributingFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Recommended Action</h4>
                <p className="text-muted-foreground">{modalAlert.aiExplanation.recommendedAction}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

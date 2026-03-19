import { Shield, CheckCircle, AlertTriangle, Clock, Wifi, WifiOff } from 'lucide-react';
import { branches } from '@/data/mockData';

export default function FederatedLearning() {
  const statusBadge: Record<string, string> = {
    Synced: 'badge-success',
    Training: 'badge-investigate',
    Pending: 'badge-urgent',
    Error: 'badge-critical',
  };
  const statusIcon: Record<string, typeof CheckCircle> = {
    Synced: CheckCircle,
    Training: Clock,
    Pending: Clock,
    Error: WifiOff,
  };

  const totalAccuracy = (branches.reduce((s, b) => s + b.modelAccuracy, 0) / branches.length).toFixed(1);
  const syncedCount = branches.filter(b => b.trainingStatus === 'Synced').length;

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Federated Learning</h3>
            <p className="text-sm text-muted-foreground">
              Each branch trains a local anomaly detection model on its own data — customer data never leaves the branch.
              Periodically, model parameters (not data) are aggregated into a global model, improving detection accuracy across the bank.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((branch, idx) => {
          const StatusIcon = statusIcon[branch.trainingStatus] || Clock;
          return (
            <div key={branch.id} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${0.05 + idx * 0.05}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{branch.name}</h4>
                  <p className="text-xs text-muted-foreground">{branch.city}</p>
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${statusBadge[branch.trainingStatus]}`}>
                  <StatusIcon className="h-3 w-3" /> {branch.trainingStatus}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="text-foreground text-xs font-mono">{branch.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Local Anomalies</span>
                  <span className="font-semibold text-foreground">{branch.localAnomalies}</span>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Model Accuracy</span>
                    <span className="font-semibold text-foreground">{branch.modelAccuracy}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(30,91,181,0.1)' }}>
                    <div className="h-full rounded-full animate-fill glow-bar-green" style={{ width: `${branch.modelAccuracy}%`, backgroundColor: '#10B981' }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <Shield className="h-3 w-3" style={{ color: '#10B981' }} />
                  <span className="text-xs font-medium" style={{ color: '#10B981' }}>Data Never Left Branch</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Stats */}
      <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
        <h3 className="text-sm font-semibold text-foreground mb-4">Global Model Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Overall Accuracy', value: `${totalAccuracy}%` },
            { label: 'Training Rounds', value: '847' },
            { label: 'Last Global Update', value: '2025-03-08 08:30', small: true },
            { label: 'Active Branches', value: `${syncedCount}/${branches.length}` },
          ].map(stat => (
            <div key={stat.label} className="text-center p-3 glass-inner">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              {stat.small ? (
                <p className="text-sm font-semibold text-foreground mt-1">{stat.value}</p>
              ) : (
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Training Progress */}
      <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Training Round Progress</h3>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(30,91,181,0.1)' }}>
          <div className="h-full rounded-full animate-train" style={{ background: 'linear-gradient(90deg, #1A3B7A, #1E5BB5)', boxShadow: '0 0 12px rgba(30,91,181,0.5)' }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Simulated training round in progress...</p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Users, AlertTriangle, ShieldAlert, Globe, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { alertTrendData, recentActivityFeed, employees } from '@/data/mockData';

const statCards = [
  { label: 'Total Monitored', value: 247, icon: Users, trend: 'up', change: '+12', gradient: 'linear-gradient(135deg, #1A3B7A, #1E5BB5)', isAlert: false },
  { label: 'Active Alerts', value: 12, icon: AlertTriangle, trend: 'up', change: '+3', gradient: 'linear-gradient(135deg, #E8201A, #FF6B35)', isAlert: true },
  { label: 'Critical Risk Users', value: 5, icon: ShieldAlert, trend: 'up', change: '+1', gradient: 'linear-gradient(135deg, #E8201A, #FF4444)', isAlert: true },
  { label: 'Avg Risk Score', value: 34, icon: Activity, trend: 'down', change: '-2', gradient: 'linear-gradient(135deg, #10B981, #2E7BC4)', isAlert: false },
  { label: 'Predictions Triggered', value: 8, icon: TrendingUp, trend: 'up', change: '+2', gradient: 'linear-gradient(135deg, #1E5BB5, #2E7BC4)', isAlert: false },
];

const riskDistribution = [
  { name: 'Low', value: 178, color: '#10B981' },
  { name: 'Medium', value: 48, color: '#F59E0B' },
  { name: 'High', value: 16, color: '#E8201A' },
  { name: 'Critical', value: 5, color: '#1E5BB5' },
];

const extraActivities = [
  { employeeName: 'Rohan Desai', action: 'VPN access from new location', severity: 'Monitor', timestamp: 'just now' },
  { employeeName: 'Ananya Patel', action: 'Bulk FX data query detected', severity: 'Monitor', timestamp: 'just now' },
  { employeeName: 'Meera Reddy', action: 'Unusual login pattern detected', severity: 'Investigate', timestamp: 'just now' },
];

function SeverityBadge({ severity }: { severity: string }) {
  const classes: Record<string, string> = {
    Critical: 'badge-critical',
    Urgent: 'badge-urgent',
    Investigate: 'badge-investigate',
    Monitor: 'badge-monitor',
  };
  return (
    <span className={`text-xs font-semibold ${classes[severity] || classes.Monitor}`}>
      {severity}
    </span>
  );
}

const chartTooltipStyle = {
  backgroundColor: 'rgba(6, 13, 31, 0.95)',
  border: '1px solid rgba(30, 91, 181, 0.3)',
  borderRadius: 12,
  color: '#F0F4FF',
};

export default function Dashboard() {
  const [activities, setActivities] = useState(recentActivityFeed);
  const [extraIdx, setExtraIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = {
          ...extraActivities[extraIdx % extraActivities.length],
          id: Date.now(),
        };
        setExtraIdx(i => i + 1);
        return [newActivity, ...prev.slice(0, 5)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [extraIdx]);

  return (
    <div className="space-y-6 relative">
      {/* Decorative gradient orbs — Union Bank branded */}
      <div className="fixed pointer-events-none orb-decor" style={{ top: '5%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,59,122,0.08) 0%, transparent 70%)', zIndex: 0 }} />
      <div className="fixed pointer-events-none orb-decor" style={{ bottom: '10%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,32,26,0.04) 0%, transparent 70%)', zIndex: 0 }} />
      <div className="fixed pointer-events-none orb-decor" style={{ top: '50%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,91,181,0.05) 0%, transparent 70%)', zIndex: 0 }} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {statCards.map((card, idx) => (
          <div
            key={card.label}
            className="glass-card p-4 flex flex-col gap-2 relative overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.05}s`, boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(30,91,181,0.5)' }}
          >
            {/* Watermark icon */}
            <card.icon className="absolute -right-2 -bottom-2 h-16 w-16 opacity-[0.04]" />
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.gradient }}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
              {card.trend === 'up' ? (
                <span className="flex items-center text-xs font-medium" style={{ color: '#E8201A', textShadow: '0 0 8px rgba(232,32,26,0.4)' }}>
                  <ArrowUpRight className="h-3 w-3" />{card.change}
                </span>
              ) : card.trend === 'down' ? (
                <span className="flex items-center text-xs font-medium" style={{ color: '#10B981', textShadow: '0 0 8px rgba(16,185,129,0.4)' }}>
                  <ArrowDownRight className="h-3 w-3" />{card.change}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
            <p className={`text-[32px] font-bold leading-none ${card.isAlert ? 'gradient-text-danger' : 'gradient-text'}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {riskDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold text-foreground ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Alert Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={alertTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,91,181,0.08)" />
              <XAxis dataKey="day" tick={{ fill: '#8BA3C7', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8BA3C7', fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="raised" stroke="#E8201A" strokeWidth={2.5} name="Alerts Raised" dot={{ r: 3, fill: '#E8201A' }} />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2.5} name="Alerts Resolved" dot={{ r: 3, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 relative z-10">
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity Feed</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.map((activity, i) => (
              <div key={`${activity.id}-${i}`} className="flex items-start gap-3 p-2 rounded-xl glass-inner transition-all duration-300">
                <div className="mt-0.5">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{activity.employeeName}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <SeverityBadge severity={activity.severity} />
                  <span className="text-[10px] text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

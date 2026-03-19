import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { peerGroupAverages } from '@/data/mockData';
import { BarChart3, AlertTriangle } from 'lucide-react';

const metricLabels: Record<string, string> = {
  dailyLogins: 'Daily Logins',
  filesAccessed: 'Files Accessed',
  transactions: 'Transactions',
  afterHoursActivity: 'After Hours Activity',
  systemsAccessed: 'Systems Accessed',
  dataDownloadedGB: 'Data Downloaded (GB)',
};

const chartTooltipStyle = {
  backgroundColor: 'rgba(6, 13, 31, 0.95)',
  border: '1px solid rgba(30, 91, 181, 0.3)',
  borderRadius: 12,
  color: '#F0F4FF',
};

export default function PeerAnalytics() {
  const { employees } = useAppContext();
  const [selectedId, setSelectedId] = useState(employees[0]?.id || '');
  const emp = employees.find(e => e.id === selectedId);

  const peerAvg = emp ? peerGroupAverages[emp.department] || peerGroupAverages['IT'] : null;

  const chartData = useMemo(() => {
    if (!emp || !peerAvg) return [];
    const multiplier = 1 + (emp.peerDeviationScore / 100);
    return Object.entries(peerAvg).map(([key, avg]) => ({
      metric: metricLabels[key] || key,
      employee: +(avg * multiplier).toFixed(1),
      peerAverage: avg,
    }));
  }, [emp, peerAvg]);

  const deviations = chartData.map(d => {
    const dev = ((d.employee - d.peerAverage) / d.peerAverage * 100);
    const status = dev > 100 ? 'Critical Outlier' : dev > 50 ? 'Significantly Elevated' : dev > 20 ? 'Slightly Elevated' : 'Within Normal';
    const badgeClass = dev > 100 ? 'badge-critical' : dev > 50 ? 'badge-urgent' : dev > 20 ? 'badge-investigate' : 'badge-success';
    return { ...d, deviation: dev.toFixed(1), status, badgeClass };
  });

  const overallVerdict = !emp ? '' : emp.peerDeviationScore > 80 ? 'Critical outlier — immediate review required' :
    emp.peerDeviationScore > 60 ? 'Significant outlier — investigation recommended' :
    emp.peerDeviationScore > 30 ? 'Moderate peer deviation detected' : 'Within normal range';
  const verdictBadge = !emp ? '' : emp.peerDeviationScore > 80 ? 'badge-critical' :
    emp.peerDeviationScore > 60 ? 'badge-urgent' :
    emp.peerDeviationScore > 30 ? 'badge-investigate' : 'badge-success';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="glass-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          style={{ borderRadius: 12 }}
        >
          {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.department}</option>)}
        </select>
      </div>

      {emp && (
        <>
          <div className="glass-card p-5 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {emp.name} vs {emp.department} Peer Average
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,91,181,0.08)" />
                <XAxis dataKey="metric" tick={{ fill: '#8BA3C7', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: '#8BA3C7', fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
                <Bar dataKey="employee" fill="#E8201A" name={emp.name} radius={[4, 4, 0, 0]} />
                <Bar dataKey="peerAverage" fill="#1E5BB5" name="Peer Average" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <table className="w-full text-sm">
              <thead className="glass-thead">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Metric</th>
                  <th className="text-right py-3 px-4 font-medium">Employee</th>
                  <th className="text-right py-3 px-4 font-medium">Peer Avg</th>
                  <th className="text-right py-3 px-4 font-medium">Deviation</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="glass-tbody">
                {deviations.map(d => (
                  <tr key={d.metric}>
                    <td className="py-2.5 px-4 text-foreground">{d.metric}</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-foreground">{d.employee}</td>
                    <td className="py-2.5 px-4 text-right text-muted-foreground">{d.peerAverage}</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-foreground">{d.deviation}%</td>
                    <td className="py-2.5 px-4">
                      <span className={`text-xs font-semibold ${d.badgeClass}`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 text-center animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <p className="text-xs text-muted-foreground mb-2">Peer Outlier Score</p>
              <p className={`text-4xl font-bold ${emp.peerDeviationScore > 70 ? 'gradient-text-danger' : emp.peerDeviationScore > 30 ? 'gradient-text' : 'gradient-text-success'}`}>
                {emp.peerDeviationScore}
              </p>
              <div className="h-2 rounded-full mt-3 max-w-xs mx-auto overflow-hidden" style={{ background: 'rgba(30,91,181,0.1)' }}>
                <div
                  className={`h-full rounded-full animate-fill ${emp.peerDeviationScore > 70 ? 'glow-bar-red' : emp.peerDeviationScore > 30 ? 'glow-bar-amber' : 'glow-bar-green'}`}
                  style={{ width: `${emp.peerDeviationScore}%`, backgroundColor: emp.peerDeviationScore > 70 ? '#E8201A' : emp.peerDeviationScore > 30 ? '#F59E0B' : '#10B981' }}
                />
              </div>
            </div>
            <div className={`glass-card p-5 flex items-center gap-3 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
              <div className={`${verdictBadge} flex items-center gap-2 text-sm font-semibold`}>
                <AlertTriangle className="h-4 w-4" />
                {overallVerdict}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

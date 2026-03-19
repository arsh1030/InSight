import { useState, useMemo } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { generatePredictionTrajectory } from '@/data/mockData';

const COLORS = ['#E8201A', '#F59E0B', '#2E7BC4', '#1E5BB5', '#10B981'];

const chartTooltipStyle = {
  backgroundColor: 'rgba(6, 13, 31, 0.95)',
  border: '1px solid rgba(30, 91, 181, 0.3)',
  borderRadius: 12,
  color: '#F0F4FF',
};

export default function PredictiveForecasting() {
  const { employees } = useAppContext();
  const [deptFilter, setDeptFilter] = useState('All');
  const [verdictFilter, setVerdictFilter] = useState('All');

  const departments = ['All', ...new Set(employees.map(e => e.department))];

  const getVerdict = (score: number) => score > 75 ? 'Imminent Threat' : score > 45 ? 'Elevated Threat' : 'Low Threat';
  const getVerdictBadge = (score: number) => score > 75 ? 'badge-critical' : score > 45 ? 'badge-urgent' : 'badge-success';

  const sorted = [...employees]
    .filter(e => {
      const matchDept = deptFilter === 'All' || e.department === deptFilter;
      const verdict = getVerdict(e.predictionScore);
      const matchVerdict = verdictFilter === 'All' || verdict === verdictFilter;
      return matchDept && matchVerdict;
    })
    .sort((a, b) => b.predictionScore - a.predictionScore);

  const top5 = sorted.slice(0, 5);
  const top3 = sorted.slice(0, 3);

  const trajectoryData = useMemo(() => {
    const allData: Record<number, Record<string, number>> = {};
    top5.forEach(emp => {
      const data = generatePredictionTrajectory(emp.id);
      data.forEach(d => {
        if (!allData[d.day]) allData[d.day] = { day: d.day };
        allData[d.day][emp.name] = d.risk;
      });
    });
    return Object.values(allData);
  }, [top5.map(e => e.id).join(',')]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Survival Analysis Model</h3>
            <p className="text-sm text-muted-foreground">
              This module uses a Cox Proportional Hazards model to predict the probability of an insider threat event within 30 and 60 day windows.
              It analyzes behavioral baselines, peer deviations, HR events, and dark web exposure to generate threat forecasts for each employee.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="glass-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          style={{ borderRadius: 12 }}
        >
          {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
        </select>
        <select
          value={verdictFilter}
          onChange={e => setVerdictFilter(e.target.value)}
          className="glass-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          style={{ borderRadius: 12 }}
        >
          <option value="All">All Verdicts</option>
          <option value="Low Threat">Low Threat</option>
          <option value="Elevated Threat">Elevated Threat</option>
          <option value="Imminent Threat">Imminent Threat</option>
        </select>
      </div>

      {/* Featured Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((emp, i) => (
            <div key={emp.id} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full avatar-gradient-${(i % 6) + 1} flex items-center justify-center text-sm font-bold text-white`} style={{ boxShadow: '0 0 0 2px rgba(30,91,181,0.5)' }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                <div className="glass-inner p-2">
                  <p className="text-xs text-muted-foreground">Current Risk</p>
                  <p className="text-lg font-bold gradient-text">{emp.riskScore}</p>
                </div>
                <div className="glass-inner p-2">
                  <p className="text-xs text-muted-foreground">Prediction</p>
                  <p className="text-lg font-bold gradient-text-danger">{emp.predictionScore}%</p>
                </div>
              </div>
              <span className={`block text-center text-xs font-bold ${getVerdictBadge(emp.predictionScore)}`}>
                {getVerdict(emp.predictionScore)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <table className="w-full text-sm">
          <thead className="glass-thead">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Name</th>
              <th className="text-left py-3 px-4 font-medium">Role</th>
              <th className="text-center py-3 px-4 font-medium">Risk Score</th>
              <th className="text-center py-3 px-4 font-medium">30-Day</th>
              <th className="text-center py-3 px-4 font-medium">60-Day</th>
              <th className="text-center py-3 px-4 font-medium">Trend</th>
              <th className="text-left py-3 px-4 font-medium">Verdict</th>
            </tr>
          </thead>
          <tbody className="glass-tbody">
            {sorted.map(emp => {
              const f30 = Math.min(99, emp.predictionScore + 3);
              const f60 = Math.min(99, emp.predictionScore + 10);
              return (
                <tr key={emp.id}>
                  <td className="py-2.5 px-4 font-medium text-foreground">{emp.name}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{emp.role}</td>
                  <td className="py-2.5 px-4 text-center font-semibold text-foreground">{emp.riskScore}</td>
                  <td className="py-2.5 px-4 text-center font-semibold text-foreground">{f30}%</td>
                  <td className="py-2.5 px-4 text-center font-semibold text-foreground">{f60}%</td>
                  <td className="py-2.5 px-4 text-center">
                    {emp.predictionScore > 50 ? (
                      <ArrowUpRight className="h-4 w-4 mx-auto" style={{ color: '#E8201A', filter: 'drop-shadow(0 0 4px rgba(232,32,26,0.4))' }} />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mx-auto" style={{ color: '#10B981', filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.4))' }} />
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`text-xs font-semibold ${getVerdictBadge(emp.predictionScore)}`}>
                      {getVerdict(emp.predictionScore)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trajectory Chart */}
      {trajectoryData.length > 0 && (
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">60-Day Risk Trajectory — Top 5</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trajectoryData}>
              <defs>
                {top5.map((emp, i) => (
                  <linearGradient key={emp.id} id={`trajGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[i]} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,91,181,0.08)" />
              <XAxis dataKey="day" tick={{ fill: '#8BA3C7', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8BA3C7', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              {top5.map((emp, i) => (
                <Area key={emp.id} type="monotone" dataKey={emp.name} stroke={COLORS[i]} fill={`url(#trajGrad${i})`} strokeWidth={2.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

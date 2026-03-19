import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Globe, Eye } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function EmployeeMonitor() {
  const { employees, setSelectedEmployeeId } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  const departments = ['All', ...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    const matchRisk = riskFilter === 'All' ||
      (riskFilter === 'Low' && e.riskScore < 30) ||
      (riskFilter === 'Medium' && e.riskScore >= 30 && e.riskScore <= 70) ||
      (riskFilter === 'High' && e.riskScore > 70);
    return matchSearch && matchDept && matchRisk;
  });

  const handleViewProfile = (id: string) => {
    setSelectedEmployeeId(id);
    navigate('/profile');
  };

  const riskBarColor = (score: number) => score < 30 ? '#10B981' : score <= 70 ? '#F59E0B' : '#E8201A';
  const riskGlowClass = (score: number) => score < 30 ? 'glow-bar-green' : score <= 70 ? 'glow-bar-amber' : 'glow-bar-red';

  const statusBadge = (status: string) => {
    if (status === 'Active') return 'badge-success';
    if (status === 'Flagged') return 'badge-critical';
    return 'badge-urgent';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ borderRadius: 12 }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="glass-card pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            style={{ borderRadius: 12 }}
          >
            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
        </div>
        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
          className="glass-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          style={{ borderRadius: 12 }}
        >
          <option value="All">All Risk Levels</option>
          <option value="Low">Low (&lt;30)</option>
          <option value="Medium">Medium (30-70)</option>
          <option value="High">High (&gt;70)</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="glass-thead">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Employee</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-left py-3 px-4 font-medium">Department</th>
                <th className="text-left py-3 px-4 font-medium">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium">Peer Dev.</th>
                <th className="text-left py-3 px-4 font-medium">Last Login</th>
                <th className="text-center py-3 px-4 font-medium">Anomalies</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-center py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="glass-tbody">
              {filtered.map((emp, idx) => (
                <tr key={emp.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full avatar-gradient-${(idx % 6) + 1} flex items-center justify-center text-xs font-bold text-white`} style={{ boxShadow: '0 0 0 2px rgba(30,91,181,0.5)' }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-foreground">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{emp.role}</td>
                  <td className="py-3 px-4 text-muted-foreground">{emp.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden max-w-[80px]" style={{ background: 'rgba(30,91,181,0.1)' }}>
                        <div
                          className={`h-full rounded-full animate-fill ${riskGlowClass(emp.riskScore)}`}
                          style={{ width: `${emp.riskScore}%`, backgroundColor: riskBarColor(emp.riskScore) }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-7">{emp.riskScore}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold ${emp.peerDeviationScore > 60 ? 'badge-critical' : emp.peerDeviationScore > 30 ? 'badge-urgent' : 'badge-success'}`}>
                      {emp.peerDeviationScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{emp.lastLogin}</td>
                  <td className="py-3 px-4 text-center font-semibold text-foreground">{emp.anomaliesDetected}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold ${statusBadge(emp.status)}`}>{emp.status}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleViewProfile(emp.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-accent transition-colors duration-200"
                    >
                      <Eye className="h-3 w-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No employees match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

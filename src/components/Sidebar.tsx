import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, AlertTriangle, UserCheck, BarChart3,
  TrendingUp, Network, FileText, Eye
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', label: 'Employee Monitor', icon: Users },
  { path: '/alerts', label: 'Alert Panel', icon: AlertTriangle },
  { path: '/profile', label: 'Risk Profile', icon: UserCheck },
  { path: '/peer-analytics', label: 'Peer Analytics', icon: BarChart3 },
  { path: '/predictions', label: 'Predictions', icon: TrendingUp },
  { path: '/federated', label: 'Federated Learning', icon: Network },
  { path: '/compliance', label: 'Compliance', icon: FileText },
];

export default function Sidebar() {
  const location = useLocation();
  const { activeAlertCount } = useAppContext();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 glass-sidebar flex flex-col z-50">
      {/* Animated gradient line at top — Union Bank blue to red */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #1A3B7A, #E8201A, #1A3B7A)', backgroundSize: '200% 100%', animation: 'shimmerLine 3s linear infinite' }} />
      <style>{`@keyframes shimmerLine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      {/* Logo */}
      <div className="relative flex items-center gap-2 px-5 py-5 border-b" style={{ borderColor: isLight ? 'rgba(26,59,122,0.1)' : 'rgba(30,91,181,0.15)' }}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full opacity-[0.15]" style={{ background: 'radial-gradient(circle, #1E5BB5 0%, #2E7BC4 40%, transparent 70%)' }} />
        <Eye className="h-7 w-7 relative z-10 breathing-glow" style={{ color: isLight ? '#1E5BB5' : undefined }} />
        <span className="text-xl font-bold gradient-text relative z-10 tracking-tight">InSight</span>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-200 relative
                ${isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'}`}
              style={isActive ? {
                background: isLight ? 'rgba(26, 59, 122, 0.08)' : 'rgba(30, 91, 181, 0.22)',
                borderLeft: isLight ? '2px solid #1A3B7A' : '2px solid #1E5BB5',
                boxShadow: isLight ? undefined : '-2px 0 12px rgba(30, 91, 181, 0.4)',
                color: isLight ? '#1A3B7A' : undefined,
              } : undefined}
            >
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: isLight ? 'rgba(26, 59, 122, 0.06)' : 'rgba(30, 91, 181, 0.15)',
                  borderLeft: isActive ? undefined : (isLight ? '2px solid #1A3B7A' : '2px solid #1E5BB5'),
                }}
              />
              <item.icon
                className={`h-[18px] w-[18px] flex-shrink-0 relative z-10 transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                style={isActive && isLight ? { color: '#1A3B7A' } : (!isActive && isLight ? { color: '#4A6080' } : undefined)}
              />
              <span className="relative z-10" style={isActive && isLight ? { color: '#1A3B7A' } : undefined}>{item.label}</span>
              {item.path === '/alerts' && activeAlertCount > 0 && (
                <span className="ml-auto relative z-10 badge-critical text-[10px] font-bold">
                  {activeAlertCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t" style={{ borderColor: isLight ? 'rgba(26,59,122,0.1)' : 'rgba(30,91,181,0.15)' }}>
        <p className="text-xs text-muted-foreground">InSight v2.1.0</p>
        <p className="text-[10px]" style={{ color: isLight ? '#4A6080' : '#8BA3C7' }}>Powered by Union Bank of India</p>
      </div>
    </aside>
  );
}

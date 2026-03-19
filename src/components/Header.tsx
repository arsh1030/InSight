import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Eye, ChevronRight, Sun, Moon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'Employee Monitor',
  '/alerts': 'Real-Time Alert Panel',
  '/profile': 'Employee Risk Profile',
  '/peer-analytics': 'Peer Group Analytics',
  '/predictions': 'Predictive Threat Forecasting',
  '/federated': 'Federated Learning Status',
  '/compliance': 'Compliance Report Generator',
};

export default function Header() {
  const location = useLocation();
  const { activeAlertCount } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());
  const pageTitle = pageTitles[location.pathname] || 'InSight';

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 glass-header flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-primary" />
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-5">
        <span className="text-sm text-muted-foreground font-mono">
          {time.toLocaleTimeString('en-IN', { hour12: true })}
        </span>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="theme-toggle-btn"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className={`theme-toggle-icon ${theme === 'dark' ? 'active' : ''}`}>
            <Moon className="h-4 w-4" />
          </span>
          <span className={`theme-toggle-icon ${theme === 'light' ? 'active' : ''}`}>
            <Sun className="h-4 w-4" />
          </span>
        </button>

        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8201A, #FF6B35)', color: 'white' }}>
              {activeAlertCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

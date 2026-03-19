import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { employees as initialEmployees, alerts as initialAlerts, type Employee, type Alert } from '@/data/mockData';

interface AppState {
  employees: Employee[];
  alerts: Alert[];
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  dismissAlert: (id: string) => void;
  escalateAlert: (id: string) => void;
  updateEmployeeRiskScore: (empId: string, newScore: number) => void;
  activeAlertCount: number;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const escalateAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Escalated' } : a));
  }, []);

  const updateEmployeeRiskScore = useCallback((empId: string, newScore: number) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, riskScore: newScore } : e));
  }, []);

  const activeAlertCount = alerts.filter(a => a.status === 'Open').length;

  return (
    <AppContext.Provider value={{
      employees, alerts, selectedEmployeeId, setSelectedEmployeeId,
      dismissAlert, escalateAlert, updateEmployeeRiskScore, activeAlertCount
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

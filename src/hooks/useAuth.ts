import { useState, useCallback } from 'react';
import type { User, UserRole } from '../types';

const STORAGE_KEY = 'ksp_user';

export const ROLE_CONFIGS = {
  investigator: {
    label: 'Investigator',
    description: 'Query FIRs, accused profiles, evidence and investigation leads',
    color: '#60a5fa', bgColor: 'rgba(96,165,250,0.12)',
    access: ['chat', 'network', 'heatmap', 'analytics', 'profile'],
  },
  analyst: {
    label: 'Crime Analyst',
    description: 'Deep pattern analysis, trend reports, forecasting and network mapping',
    color: '#a78bfa', bgColor: 'rgba(167,139,250,0.12)',
    access: ['chat', 'network', 'heatmap', 'analytics', 'profile', 'forecast'],
  },
  supervisor: {
    label: 'Supervisor',
    description: 'Full access — case oversight, team intelligence, priority alerts',
    color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)',
    access: ['chat', 'network', 'heatmap', 'analytics', 'profile', 'forecast', 'admin'],
  },
  policymaker: {
    label: 'Policymaker',
    description: 'District-level insights, resource allocation, strategic analytics',
    color: '#34d399', bgColor: 'rgba(52,211,153,0.12)',
    access: ['analytics', 'heatmap', 'forecast'],
  },
} as const;

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login = useCallback((name: string, role: UserRole, district: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      role,
      district,
      badgeNumber: `KSP-${Math.floor(Math.random() * 90000) + 10000}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, logout, isAuthenticated: !!user };
}
import { create } from 'zustand';
import { isSameMonth, isSameWeek, parseISO } from 'date-fns';
import { queryClient } from './queryClient';

export interface Report {
  id: number;
  created_at: string;
  agent?: string;
  lokacija: string;
  obiskani: number;
  odzvani: number;
  fix: number;
  mob: number;
  vs: number;
  tw: number;
  ure: number;
  priimki: string[];
  raw_text: string;
}

export interface Stats {
  totalFix: number;
  totalMob: number;
  totalSales: number;
  avgConversion: number;
  salesSuccessRate: number;
  totalHours: number;
  reportCount: number;
}

interface ReportStore {
  reports: Report[];
  isLoading: boolean;
  fetchReports: () => Promise<void>;
  addReport: (report: Omit<Report, 'id' | 'created_at'>) => Promise<void>;
  deleteReport: (id: number) => Promise<void>;
  getAgents: () => string[];
  getStats: (filter?: { agent?: string | 'all', timeframe?: 'week' | 'month' | 'all' }) => Stats;
  getFilteredReports: (filter?: { agent?: string | 'all', timeframe?: 'week' | 'month' | 'all' }) => Report[];
}

export const useReportStore = create<ReportStore>((set, get) => ({
  reports: [],
  isLoading: false,

  fetchReports: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/reports');
      if (!res.ok) throw new Error('Failed to fetch reports');
      const reports = await res.json();
      set({ reports });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addReport: async (reportData) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!res.ok) throw new Error('Failed to add report');
      const newReport = await res.json();
      set((state) => ({ reports: [newReport, ...state.reports] }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteReport: async (id) => {
    try {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      set((state) => ({ reports: state.reports.filter((r) => r.id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },
  
  getAgents: () => {
    const { reports } = get();
    const agents = new Set<string>();
    reports.forEach(r => {
      if (r.agent) agents.add(r.agent);
    });
    return Array.from(agents).sort();
  },

  getFilteredReports: (filter) => {
    const { reports } = get();
    let filtered = reports;

    if (filter?.agent && filter.agent !== 'all') {
      filtered = filtered.filter(r => r.agent === filter.agent);
    }

    if (filter?.timeframe === 'week') {
      const now = new Date();
      filtered = filtered.filter(r => isSameWeek(parseISO(r.created_at), now, { weekStartsOn: 1 })); // Monday start
    } else if (filter?.timeframe === 'month') {
      const now = new Date();
      filtered = filtered.filter(r => isSameMonth(parseISO(r.created_at), now));
    }

    return filtered;
  },

  getStats: (filter) => {
    const filteredReports = get().getFilteredReports(filter);
    
    const totalFix = filteredReports.reduce((acc, r) => acc + r.fix, 0);
    const totalMob = filteredReports.reduce((acc, r) => acc + r.mob, 0);
    const totalObiskani = filteredReports.reduce((acc, r) => acc + r.obiskani, 0);
    const totalOdzvani = filteredReports.reduce((acc, r) => acc + r.odzvani, 0);
    const totalHours = filteredReports.reduce((acc, r) => acc + r.ure, 0);

    const avgConversion = totalObiskani > 0 ? (totalOdzvani / totalObiskani) * 100 : 0;
    const salesSuccessRate = totalOdzvani > 0 ? (totalFix / totalOdzvani) * 100 : 0;

    return {
      totalFix,
      totalMob,
      totalSales: totalFix + totalMob,
      avgConversion,
      salesSuccessRate,
      totalHours,
      reportCount: filteredReports.length
    };
  },
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSameMonth, parseISO } from 'date-fns';

export interface Report {
  id: string;
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
  addReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  getAgents: () => string[];
  getStats: (filter?: { agent?: string | 'all', month?: 'current' | 'all' }) => Stats;
  getFilteredReports: (filter?: { agent?: string | 'all', month?: 'current' | 'all' }) => Report[];
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
      deleteReport: (id) => set((state) => ({ reports: state.reports.filter((r) => r.id !== id) })),
      
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

        if (filter?.month === 'current') {
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
    }),
    {
      name: 'sales-reports-storage',
    }
  )
);

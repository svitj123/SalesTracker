import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Report {
  id: string;
  created_at: string;
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

interface ReportStore {
  reports: Report[];
  addReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  getStats: () => {
    totalFix: number;
    totalMob: number;
    totalSales: number;
    avgConversion: number;
    totalHours: number;
  };
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
      deleteReport: (id) => set((state) => ({ reports: state.reports.filter((r) => r.id !== id) })),
      getStats: () => {
        const { reports } = get();
        const totalFix = reports.reduce((acc, r) => acc + r.fix, 0);
        const totalMob = reports.reduce((acc, r) => acc + r.mob, 0);
        const totalObiskani = reports.reduce((acc, r) => acc + r.obiskani, 0);
        const totalOdzvani = reports.reduce((acc, r) => acc + r.odzvani, 0);
        const totalHours = reports.reduce((acc, r) => acc + r.ure, 0);

        return {
          totalFix,
          totalMob,
          totalSales: totalFix + totalMob,
          avgConversion: totalObiskani > 0 ? (totalOdzvani / totalObiskani) * 100 : 0,
          totalHours,
        };
      },
    }),
    {
      name: 'sales-reports-storage',
    }
  )
);

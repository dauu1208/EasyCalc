import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { Calculation } from "../types";

interface AppContextValue {
  history: Calculation[];
  loading: boolean;
  refreshHistory: () => Promise<void>;
  saveCalculation: (calculation: Calculation) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  getCalculation: (id: string) => Promise<Calculation | undefined>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHistory = useCallback(async () => {
    const rows = await db.getAllAsync<{
      id: string;
      name: string;
      date: string;
      food: string;
      unit: string;
      note: string;
      entries_json: string;
      total: number;
    }>("SELECT * FROM calculations ORDER BY created_at DESC");

    setHistory(rows.map((row) => ({
      id: row.id,
      name: row.name,
      date: row.date,
      food: row.food,
      unit: row.unit,
      note: row.note,
      entries: JSON.parse(row.entries_json),
      total: row.total
    })));
    setLoading(false);
  }, [db]);

  useEffect(() => {
    refreshHistory().catch((error) => {
      console.error("Could not load history:", error);
      setLoading(false);
    });
  }, [refreshHistory]);

  const saveCalculation = useCallback(async (calculation: Calculation) => {
    await db.runAsync(
      `INSERT OR REPLACE INTO calculations
       (id, name, date, food, unit, note, entries_json, total, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      calculation.id,
      calculation.name,
      calculation.date,
      calculation.food,
      calculation.unit,
      calculation.note,
      JSON.stringify(calculation.entries),
      calculation.total,
      new Date().toISOString()
    );
    await refreshHistory();
  }, [db, refreshHistory]);

  const deleteCalculation = useCallback(async (id: string) => {
    await db.runAsync("DELETE FROM calculations WHERE id = ?", id);
    await refreshHistory();
  }, [db, refreshHistory]);

  const getCalculation = useCallback(async (id: string) => {
    const row = await db.getFirstAsync<{
      id: string;
      name: string;
      date: string;
      food: string;
      unit: string;
      note: string;
      entries_json: string;
      total: number;
    }>("SELECT * FROM calculations WHERE id = ?", id);

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      date: row.date,
      food: row.food,
      unit: row.unit,
      note: row.note,
      entries: JSON.parse(row.entries_json),
      total: row.total
    };
  }, [db]);

  const value = useMemo(() => ({
    history,
    loading,
    refreshHistory,
    saveCalculation,
    deleteCalculation,
    getCalculation
  }), [history, loading, refreshHistory, saveCalculation, deleteCalculation, getCalculation]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
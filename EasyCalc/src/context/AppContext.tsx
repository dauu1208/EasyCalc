import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { Calculation, PriceItem, SaleItem, SalesOrder } from "../types";

interface AppContextValue {
  history: Calculation[];
  loading: boolean;
  refreshHistory: () => Promise<void>;
  saveCalculation: (calculation: Calculation) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  getCalculation: (id: string) => Promise<Calculation | undefined>;
  priceItems: PriceItem[];
  loadingPrices: boolean;
  refreshPrices: () => Promise<void>;
  savePriceItem: (item: PriceItem) => Promise<void>;
  deletePriceItem: (id: string) => Promise<void>;
  salesOrders: SalesOrder[];
  loadingSalesOrders: boolean;
  refreshSalesOrders: () => Promise<void>;
  saveSalesOrder: (customer: string, items: SaleItem[], total: number) => Promise<void>;
  deleteSalesOrder: (id: string) => Promise<void>;
  getSalesOrder: (id: string) => Promise<SalesOrder | undefined>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loadingSalesOrders, setLoadingSalesOrders] = useState(true);

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

  const refreshPrices = useCallback(async () => {
    const rows = await db.getAllAsync<{ id: string; name: string; price: number; unit: string }>(
      "SELECT id, name, price, unit FROM price_items ORDER BY created_at ASC"
    );
    setPriceItems(rows);
    setLoadingPrices(false);
  }, [db]);

  useEffect(() => {
    refreshPrices().catch((error) => {
      console.error("Could not load price list:", error);
      setLoadingPrices(false);
    });
  }, [refreshPrices]);

  const refreshSalesOrders = useCallback(async () => {
    const rows = await db.getAllAsync<{
      id: string; customer: string; items_json: string; total: number; created_at: string;
    }>("SELECT id, customer, items_json, total, created_at FROM sales_orders ORDER BY created_at DESC");
    setSalesOrders(rows.map((row) => ({
      id: row.id,
      customer: row.customer,
      items: JSON.parse(row.items_json),
      total: row.total,
      created_at: row.created_at
    })));
    setLoadingSalesOrders(false);
  }, [db]);

  useEffect(() => {
    refreshSalesOrders().catch((error) => {
      console.error("Could not load sales orders:", error);
      setLoadingSalesOrders(false);
    });
  }, [refreshSalesOrders]);

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

  const savePriceItem = useCallback(async (item: PriceItem) => {
    await db.runAsync(
      `INSERT OR REPLACE INTO price_items (id, name, price, unit, created_at) VALUES (?, ?, ?, ?, ?)`,
      item.id, item.name, item.price, item.unit, new Date().toISOString()
    );
    await refreshPrices();
  }, [db, refreshPrices]);

  const deletePriceItem = useCallback(async (id: string) => {
    await db.runAsync("DELETE FROM price_items WHERE id = ?", id);
    await refreshPrices();
  }, [db, refreshPrices]);

  const saveSalesOrder = useCallback(async (customer: string, items: SaleItem[], total: number) => {
    await db.runAsync(
      `INSERT INTO sales_orders (id, customer, items_json, total, created_at) VALUES (?, ?, ?, ?, ?)`,
      `order-${Date.now()}`, customer, JSON.stringify(items), total, new Date().toISOString()
    );
    await refreshSalesOrders();
  }, [db, refreshSalesOrders]);

  const deleteSalesOrder = useCallback(async (id: string) => {
    await db.runAsync("DELETE FROM sales_orders WHERE id = ?", id);
    await refreshSalesOrders();
  }, [db, refreshSalesOrders]);

  const getSalesOrder = useCallback(async (id: string) => {
    const row = await db.getFirstAsync<{
      id: string; customer: string; items_json: string; total: number; created_at: string;
    }>("SELECT id, customer, items_json, total, created_at FROM sales_orders WHERE id = ?", id);
    if (!row) return undefined;
    return {
      id: row.id,
      customer: row.customer,
      items: JSON.parse(row.items_json),
      total: row.total,
      created_at: row.created_at
    };
  }, [db]);

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
    getCalculation,
    priceItems,
    loadingPrices,
    refreshPrices,
    savePriceItem,
    deletePriceItem,
    salesOrders,
    loadingSalesOrders,
    refreshSalesOrders,
    saveSalesOrder,
    deleteSalesOrder,
    getSalesOrder
  }), [
    history, loading, refreshHistory, saveCalculation, deleteCalculation, getCalculation,
    priceItems, loadingPrices, refreshPrices, savePriceItem, deletePriceItem,
    salesOrders, loadingSalesOrders, refreshSalesOrders, saveSalesOrder, deleteSalesOrder, getSalesOrder
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
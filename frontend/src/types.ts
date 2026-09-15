export type Operator = "+" | "-" | "×" | "÷";

export interface Entry {
  id: number;
  operator: Operator | null;
  value: number;
}

export interface Calculation {
  id: string;
  name: string;
  date: string;
  food: string;
  unit: string;
  note: string;
  entries: Entry[];
  total: number;
}

export interface PriceItem {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface SaleItem extends PriceItem {
  quantity: number;
}

export interface SalesOrder {
  id: string;
  customer: string;
  items: SaleItem[];
  total: number;
  created_at: string;
}

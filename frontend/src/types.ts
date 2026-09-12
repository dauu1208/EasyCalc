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
import type { Entry } from "../types";

export function calculate(entries: Entry[]): number {
  if (!entries.length) return 0;

  let result = entries[0].value;

  for (let i = 1; i < entries.length; i++) {
    const { operator, value } = entries[i];

    if (operator === "+") result += value;
    if (operator === "-") result -= value;
    if (operator === "×") result *= value;
    if (operator === "÷") {
      if (value === 0) return NaN;
      result /= value;
    }
  }

  return result;
}

export function runningTotal(entries: Entry[], index: number): number {
  return calculate(entries.slice(0, index + 1));
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "Lỗi";
  return value.toLocaleString("vi-VN", { maximumFractionDigits: 4 });
}
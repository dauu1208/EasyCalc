import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type FontSizeOption = "Nhỏ" | "Vừa" | "Lớn";

export const FONT_SCALES: Record<FontSizeOption, number> = {
  "Nhỏ": 0.88,
  "Vừa": 1,
  "Lớn": 1.18
};

interface SettingsContextValue {
  fontSize: FontSizeOption;
  setFontSize: (value: FontSizeOption) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSizeOption>("Vừa");

  const value = useMemo(() => ({ fontSize, setFontSize }), [fontSize]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}

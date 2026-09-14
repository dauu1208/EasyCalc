import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "../src/db/database";
import { AppProvider } from "../src/context/AppContext";
import { SettingsProvider } from "../src/context/SettingsContext";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <SafeAreaProvider>
        <SQLiteProvider databaseName="easycalc.db" onInit={initDatabase}>
          <AppProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
          </AppProvider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </SettingsProvider>
  );
}
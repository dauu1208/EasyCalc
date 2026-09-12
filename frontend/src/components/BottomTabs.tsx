import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, usePathname } from "expo-router";
import { colors } from "../theme";

export default function BottomTabs() {
  const pathname = usePathname();

  const tabs = [
    { path: "/", label: "Trang chủ", icon: "calculator-outline" as const },
    { path: "/history", label: "Lịch sử", icon: "time-outline" as const },
    { path: "/settings", label: "Cài đặt", icon: "settings-outline" as const }
  ];

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        return (
          <Pressable key={tab.path} style={styles.item} onPress={() => router.replace(tab.path)}>
            <Ionicons name={tab.icon} size={25} color={active ? colors.primary : colors.textSoft} />
            <Text style={[styles.label, active && styles.active]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    paddingBottom: 8,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  label: { color: colors.textSoft, fontSize: 11, fontWeight: "700" },
  active: { color: colors.primary }
});
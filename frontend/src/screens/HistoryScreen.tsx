import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import BottomTabs from "../components/BottomTabs";
import { useApp } from "../context/AppContext";
import { colors, shadow } from "../theme";

const emoji: Record<string, string> = { Gà: "🐓", Heo: "🐖", Cá: "🐟", Gạo: "🌾" };

export default function HistoryScreen() {
  const { history, loading, deleteCalculation } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "month">("all");

  const filtered = useMemo(() => history.filter((item) => {
    const matches = `${item.name} ${item.food} ${item.date}`.toLowerCase().includes(query.toLowerCase());
    if (!matches) return false;
    if (filter === "today") return item.date === new Date().toLocaleDateString("vi-VN");
    if (filter === "month") return item.date.slice(3) === new Date().toLocaleDateString("vi-VN").slice(3);
    return true;
  }), [history, query, filter]);

  return (
    <View style={styles.root}>
      <Page>
        <PageHeader title="Lịch sử" />
        <View style={styles.search}>
          <Ionicons name="search" size={19} color={colors.textSoft} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Tìm theo tên, thực phẩm..." style={styles.searchInput} />
        </View>

        <View style={styles.filters}>
          {[
            ["all", "Tất cả"],
            ["today", "Hôm nay"],
            ["month", "Tháng này"]
          ].map(([value, label]) => (
            <Pressable key={value} style={[styles.filter, filter === value && styles.filterActive]} onPress={() => setFilter(value as typeof filter)}>
              <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.list}>
            {filtered.map((item) => (
              <Pressable key={item.id} style={styles.card} onPress={() => router.push(`/history/${item.id}`)}>
                <View style={styles.foodIcon}><Text style={{ fontSize: 27 }}>{emoji[item.food] ?? "📦"}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.food}>{item.food}</Text>
                  <Text style={styles.meta}>{item.date} · {item.name}</Text>
                  <Text style={styles.total}>Tổng: {item.total.toLocaleString("vi-VN")} {item.unit}</Text>
                </View>
                <Ionicons name="chevron-forward" size={21} color={colors.muted} />
                <Pressable
                  style={styles.delete}
                  onPress={() => {
                    Alert.alert("Xóa bảng tính", `Bạn có chắc muốn xóa ${item.food} ngày ${item.date}?`, [
                      { text: "Hủy", style: "cancel" },
                      { text: "Xóa", style: "destructive", onPress: () => deleteCalculation(item.id) }
                    ]);
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.magenta} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </Page>
      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingBottom: 76 },
  search: { height: 48, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 13, backgroundColor: "#fff", borderRadius: 13, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  filters: { flexDirection: "row", gap: 8, marginVertical: 13 },
  filter: { borderRadius: 99, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: colors.surfaceMuted },
  filterActive: { backgroundColor: colors.primary },
  filterText: { color: colors.textStrong, fontSize: 12, fontWeight: "900" },
  filterTextActive: { color: "#fff" },
  list: { gap: 10 },
  card: { position: "relative", minHeight: 91, borderRadius: 17, padding: 13, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 12, ...shadow },
  foodIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  food: { color: colors.text, fontSize: 17, fontWeight: "900" },
  meta: { color: colors.textSoft, fontSize: 11, marginTop: 3 },
  total: { color: colors.primary, fontSize: 13, fontWeight: "900", marginTop: 3 },
  delete: { position: "absolute", right: 10, bottom: 7, padding: 3 }
});
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import Text from "../components/AppText";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import BottomTabs from "../components/BottomTabs";
import { useApp } from "../context/AppContext";
import { colors, shadow } from "../theme";

const emoji: Record<string, string> = { Gà: "🐓", Heo: "🐖", Cá: "🐟", Gạo: "🌾" };

function saleDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

export default function HistoryScreen() {
  const { history, loading, salesOrders, loadingSalesOrders, deleteCalculation, deleteSalesOrder } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "month">("all");
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "sale"; id: string } |
    { type: "calculation"; id: string } |
    null
  >(null);

const [deleting, setDeleting] = useState(false);
  const filteredCalculations = useMemo(() => history.filter((item) => {
    const matches = `${item.name} ${item.food} ${item.date}`.toLowerCase().includes(query.toLowerCase());
    if (!matches) return false;
    if (filter === "today") return item.date === new Date().toLocaleDateString("vi-VN");
    if (filter === "month") return item.date.slice(3) === new Date().toLocaleDateString("vi-VN").slice(3);
    return true;
  }), [history, query, filter]);

  const filteredSales = useMemo(() => salesOrders.filter((order) => {
    const date = saleDate(order.created_at);
    const itemNames = order.items.map((item) => item.name).join(" ");
    const matches = `${order.customer} ${itemNames} ${date}`.toLowerCase().includes(query.toLowerCase());
    if (!matches) return false;
    if (filter === "today") return date === new Date().toLocaleDateString("vi-VN");
    if (filter === "month") return date.slice(3) === new Date().toLocaleDateString("vi-VN").slice(3);
    return true;
  }), [salesOrders, query, filter]);

  const isLoading = loading || loadingSalesOrders;

  return (
    <View style={styles.root}>
      <Page>
        <PageHeader title="Lịch sử" />
        <View style={styles.search}>
          <Ionicons name="search" size={19} color={colors.textSoft} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Tìm theo tên, thực phẩm, sản phẩm..." style={styles.searchInput} />
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

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.list}>
            {filteredSales.map((order) => {
              const date = saleDate(order.created_at);
              const preview = order.items.slice(0, 2).map((item) => `${item.name} × ${item.quantity}`).join(", ");
              const more = order.items.length > 2 ? ` +${order.items.length - 2} sản phẩm` : "";
              return (
                <Pressable key={order.id} style={styles.card} onPress={() => router.push(`/history/${order.id}`)}>
                  <View style={styles.foodIcon}><Text style={{ fontSize: 25 }}>🧾</Text></View>
                  <View style={{ flex: 1, paddingRight: 22 }}>
                    <Text style={styles.food}>Đơn bán hàng</Text>
                    <Text style={styles.meta}>{date}{order.customer ? ` · ${order.customer}` : " · Không nhập tên"}</Text>
                    <Text numberOfLines={1} style={styles.items}>{preview}{more}</Text>
                    <Text style={styles.total}>Tổng: {order.total.toLocaleString("vi-VN")}đ</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={21} color={colors.muted} />
                  <Pressable
                    style={styles.delete}
                    onPress={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ type: "sale", id: order.id });
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.magenta} />
                  </Pressable>
                </Pressable>
              );
            })}

            {filteredCalculations.map((item) => (
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
                  onPress={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ type: "calculation", id: item.id });
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.magenta} />
                </Pressable>
              </Pressable>
            ))}

            {filteredSales.length === 0 && filteredCalculations.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🧾</Text>
                <Text style={styles.emptyTitle}>Chưa có lịch sử</Text>
                <Text style={styles.emptyText}>Đơn hàng đã lưu sẽ xuất hiện ở đây.</Text>
              </View>
            ) : null}
          </View>
        )}
        <Modal
          visible={deleteTarget !== null}
          transparent
          animationType="fade"
          onRequestClose={() => !deleting && setDeleteTarget(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModal}>
              <View style={styles.confirmIcon}>
                <Ionicons
                  name="trash-outline"
                  size={27}
                  color={colors.magenta}
                />
              </View>

              <Text style={styles.confirmTitle}>
                {deleteTarget?.type === "sale"
                  ? "Xóa đơn hàng?"
                  : "Xóa bảng cân?"}
              </Text>

              <Text style={styles.confirmText}>
                Dữ liệu này sẽ bị xóa khỏi lịch sử. Bạn có chắc muốn tiếp tục?
              </Text>

              <View style={styles.confirmActions}>
                <Pressable
                  style={styles.cancelDeleteButton}
                  disabled={deleting}
                  onPress={() => setDeleteTarget(null)}
                >
                  <Text style={styles.cancelDeleteText}>Hủy</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.confirmDeleteButton,
                    deleting && styles.disabledButton,
                  ]}
                  disabled={deleting}
                  onPress={async () => {
                    if (!deleteTarget) return;

                    try {
                      setDeleting(true);

                      if (deleteTarget.type === "sale") {
                        await deleteSalesOrder(deleteTarget.id);
                      } else {
                        await deleteCalculation(deleteTarget.id);
                      }

                      setDeleteTarget(null);
                    } catch (error) {
                      console.error("Không thể xóa:", error);
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color="#fff"
                  />
                  <Text style={styles.confirmDeleteText}>
                    {deleting ? "Đang xóa..." : "Xóa"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

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
  items: { color: colors.textSoft, fontSize: 11, marginTop: 3 },
  total: { color: colors.primary, fontSize: 13, fontWeight: "900", marginTop: 3 },
  delete: { position: "absolute", right: 10, bottom: 7, padding: 3 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(36, 18, 28, 0.48)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  confirmModal: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 24,
    backgroundColor: "#fff",
    padding: 22,
    alignItems: "center",
    ...shadow,
  },
  confirmIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.magentaSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  confirmTitle: {
    color: colors.textStrong,
    fontSize: 20,
    fontWeight: "900",
  },
  confirmText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },
  confirmActions: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 19,
  },
  cancelDeleteButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelDeleteText: {
    color: colors.textStrong,
    fontWeight: "900",
  },
  confirmDeleteButton: {
    flex: 1.35,
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: colors.magenta,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  confirmDeleteText: {
    color: "#fff",
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.6,
  },

  empty: { alignItems: "center", paddingTop: 70 },
  emptyIcon: { fontSize: 38 },
  emptyTitle: { marginTop: 10, color: colors.textStrong, fontSize: 17, fontWeight: "900" },
  emptyText: { marginTop: 4, color: colors.textSoft, fontSize: 12 }
});

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Text from "../components/AppText";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import type { Calculation, SalesOrder } from "../types";
import { formatNumber, runningTotal } from "../utils/calculation";
import { colors, shadow } from "../theme";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCalculation, deleteCalculation, getSalesOrder, deleteSalesOrder } = useApp();
  const [calculation, setCalculation] = useState<Calculation>();
  const [order, setOrder] = useState<SalesOrder>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCalculation(id).then((value) => { if (value) setCalculation(value); });
    getSalesOrder(id).then((value) => { if (value) setOrder(value); });
  }, [id, getCalculation, getSalesOrder]);

  if (order) {
    const date = new Date(order.created_at).toLocaleDateString("vi-VN");
    const time = new Date(order.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const totalWeight = order.items.reduce((sum, item) => item.unit === "kg" ? sum + item.quantity : sum, 0);
    return (
      <Page>
        <PageHeader title="Chi tiết đơn hàng" back />
        <View style={styles.infoCard}>
          <Info label="Loại" value="🧾 Đơn bán hàng" />
          <Info label="Khách hàng" value={order.customer || "Không nhập tên"} />
          <Info label="Ngày" value={`${date} · ${time}`} />
        </View>

        <View style={styles.table}>
          <View style={styles.head}>
            <Text style={styles.headName}>Sản phẩm</Text><Text style={styles.headText}>SL</Text><Text style={styles.headText}>Đơn giá</Text><Text style={styles.headText}>Thành tiền</Text>
          </View>
          {order.items.map((item) => (
            <View style={styles.row} key={item.id}>
              <Text style={styles.nameCell}>{item.name}</Text>
              <Text style={styles.cell}>{formatNumber(item.quantity)} {item.unit}</Text>
              <Text style={styles.cell}>{item.price.toLocaleString("vi-VN")}đ</Text>
              <Text style={styles.cell}>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TỔNG TIỀN</Text>
          <Text style={styles.total}>{order.total.toLocaleString("vi-VN")}đ</Text>
          {totalWeight > 0 ? <Text style={styles.weight}>Tổng số cân nặng: {formatNumber(totalWeight)} kg</Text> : null}
        </View>

        <Pressable style={styles.deleteButton} onPress={() => setShowDeleteConfirm(true)}>
          <Ionicons name="trash-outline" size={19} color={colors.magenta} />
          <Text style={styles.deleteText}>Xóa đơn hàng</Text>
        </Pressable>

        <Modal
          visible={showDeleteConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => !deleting && setShowDeleteConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModal}>
              <View style={styles.confirmIcon}>
                <Ionicons name="trash-outline" size={27} color={colors.magenta} />
              </View>
              <Text style={styles.confirmTitle}>Xóa đơn hàng?</Text>
              <Text style={styles.confirmText}>Đơn hàng này sẽ bị xóa khỏi lịch sử. Bạn có chắc muốn tiếp tục?</Text>
              <View style={styles.confirmActions}>
                <Pressable
                  style={styles.cancelDeleteButton}
                  disabled={deleting}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.cancelDeleteText}>Hủy</Text>
                </Pressable>
                <Pressable
                  style={[styles.confirmDeleteButton, deleting && styles.disabledButton]}
                  disabled={deleting}
                  onPress={async () => {
                    try {
                      setDeleting(true);
                      await deleteSalesOrder(order.id);
                      setShowDeleteConfirm(false);
                      router.replace("/history");
                    } catch (error) {
                      console.error("Could not delete sales order:", error);
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  <Ionicons name="trash-outline" size={17} color="#fff" />
                  <Text style={styles.confirmDeleteText}>{deleting ? "Đang xóa..." : "Xóa đơn hàng"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </Page>
    );
  }

  if (!calculation) {
    return (
      <Page>
        <PageHeader title="Chi tiết" back />
        <View style={styles.notFound}><Text style={styles.notFoundText}>Không tìm thấy bảng tính.</Text></View>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title="Chi tiết" back />
      <View style={styles.infoCard}>
        <Info label="Tên người lập" value={calculation.name} />
        <Info label="Ngày" value={calculation.date} />
        <Info label="Thực phẩm" value={`🍗 ${calculation.food}`} />
        <Info label="Đơn vị" value={calculation.unit} />
        {calculation.note ? <Info label="Ghi chú" value={calculation.note} /> : null}
      </View>
      <View style={styles.table}>
        <View style={styles.head}><Text style={styles.headText}>Lần</Text><Text style={styles.headText}>Phép</Text><Text style={styles.headText}>Số lượng</Text><Text style={styles.headText}>Kết quả</Text></View>
        {calculation.entries.map((entry, index) => (
          <View style={styles.row} key={entry.id}>
            <Text style={styles.cell}>{index + 1}</Text><Text style={styles.cellOperator}>{entry.operator ?? "—"}</Text><Text style={styles.cell}>{formatNumber(entry.value)} {calculation.unit}</Text><Text style={styles.cell}>{formatNumber(runningTotal(calculation.entries, index))}</Text>
          </View>
        ))}
      </View>
      <View style={styles.totalCard}><Text style={styles.totalLabel}>TỔNG</Text><Text style={styles.total}>{formatNumber(calculation.total)} {calculation.unit}</Text></View>
      <View style={styles.actions}>
        <Pressable style={styles.edit} onPress={() => router.push({ pathname: "/calculator", params: { id: calculation.id, name: calculation.name, date: calculation.date, food: calculation.food, unit: calculation.unit, note: calculation.note, entries: JSON.stringify(calculation.entries) } })}>
          <Ionicons name="create-outline" size={19} color={colors.rosePink} /><Text style={styles.editText}>Chỉnh sửa</Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => setShowDeleteConfirm(true)}
        >
          <Ionicons name="trash-outline" size={19} color={colors.magenta} />
          <Text style={styles.deleteText}>Xóa</Text>
        </Pressable>

        <Modal
          visible={showDeleteConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => !deleting && setShowDeleteConfirm(false)}
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

              <Text style={styles.confirmTitle}>Xóa bảng cân?</Text>

              <Text style={styles.confirmText}>
                Bảng cân này sẽ bị xóa khỏi lịch sử. Bạn có chắc muốn tiếp tục?
              </Text>

              <View style={styles.confirmActions}>
                <Pressable
                  style={styles.cancelDeleteButton}
                  disabled={deleting}
                  onPress={() => setShowDeleteConfirm(false)}
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
                    try {
                      setDeleting(true);
                      await deleteCalculation(calculation.id);
                      setShowDeleteConfirm(false);
                      router.replace("/history");
                    } catch (error) {
                      console.error("Could not delete calculation:", error);
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  <Ionicons name="trash-outline" size={17} color="#fff" />
                  <Text style={styles.confirmDeleteText}>
                    {deleting ? "Đang xóa..." : "Xóa bảng cân"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Page>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  infoCard: { backgroundColor: "#fff", borderRadius: 17, padding: 16, gap: 11, ...shadow },
  infoRow: { flexDirection: "row", gap: 8 }, infoLabel: { width: 100, color: colors.textSoft, fontSize: 12 }, infoValue: { flex: 1, color: colors.textStrong, fontSize: 13, fontWeight: "800" },
  table: { marginTop: 14, backgroundColor: "#fff", overflow: "hidden", borderRadius: 16, ...shadow },
  head: { minHeight: 48, backgroundColor: colors.surfaceMuted, flexDirection: "row", alignItems: "center" },
  headText: { flex: 1, textAlign: "center", color: colors.textStrong, fontSize: 10, fontWeight: "900" },
  headName: { flex: 1.3, textAlign: "center", color: colors.textStrong, fontSize: 10, fontWeight: "900" },
  row: { minHeight: 48, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", alignItems: "center" },
  cell: { flex: 1, textAlign: "center", color: colors.textStrong, fontSize: 10 }, nameCell: { flex: 1.3, paddingHorizontal: 5, color: colors.textStrong, fontSize: 11, fontWeight: "800" },
  cellOperator: { flex: 1, textAlign: "center", color: colors.primary, fontSize: 18, fontWeight: "900" },
  totalCard: { marginTop: 13, padding: 15, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: "center" },
  totalLabel: { color: colors.primaryDark, fontSize: 11, fontWeight: "900" }, total: { color: colors.primaryDark, fontSize: 25, fontWeight: "900", marginTop: 3 },
  weight: { marginTop: 5, color: colors.textSoft, fontSize: 12, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10, marginTop: 13 },
  edit: { flex: 1, minHeight: 51, borderRadius: 14, backgroundColor: colors.rosePinkSoft, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 }, editText: { color: colors.rosePink, fontWeight: "900" },
  deleteButton: { minHeight: 51, marginTop: 13, paddingHorizontal: 18, borderRadius: 14, backgroundColor: colors.magentaSoft, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 }, deleteText: { color: colors.magenta, fontWeight: "900" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(36, 18, 28, 0.48)", alignItems: "center", justifyContent: "center", padding: 20 },
  confirmModal: { width: "100%", maxWidth: 430, borderRadius: 24, backgroundColor: "#fff", padding: 22, alignItems: "center", ...shadow },
  confirmIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.magentaSoft, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  confirmTitle: { color: colors.textStrong, fontSize: 20, fontWeight: "900" },
  confirmText: { color: colors.textSoft, fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 7 },
  confirmActions: { width: "100%", flexDirection: "row", gap: 10, marginTop: 19 },
  cancelDeleteButton: { flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: colors.surfaceMuted, alignItems: "center", justifyContent: "center" },
  cancelDeleteText: { color: colors.textStrong, fontWeight: "900" },
  confirmDeleteButton: { flex: 1.35, minHeight: 48, borderRadius: 13, backgroundColor: colors.magenta, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  confirmDeleteText: { color: "#fff", fontWeight: "900" },
  disabledButton: { opacity: 0.6 },
  notFound: { paddingTop: 80, alignItems: "center" }, notFoundText: { color: colors.textSoft }
});

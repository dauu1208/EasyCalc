import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import Text from "../components/AppText";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import type { Calculation } from "../types";
import { formatNumber, runningTotal } from "../utils/calculation";
import { colors, shadow } from "../theme";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCalculation, deleteCalculation } = useApp();
  const [calculation, setCalculation] = useState<Calculation>();

  useEffect(() => {
    if (id) getCalculation(id).then(setCalculation);
  }, [id, getCalculation]);

  if (!calculation) {
    return (
      <Page>
        <PageHeader title="Chi tiết" back />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Không tìm thấy bảng tính.</Text>
        </View>
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
        <View style={styles.head}>
          <Text style={styles.headText}>Lần</Text><Text style={styles.headText}>Phép</Text><Text style={styles.headText}>Số lượng</Text><Text style={styles.headText}>Kết quả</Text>
        </View>
        {calculation.entries.map((entry, index) => (
          <View style={styles.row} key={entry.id}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cellOperator}>{entry.operator ?? "—"}</Text>
            <Text style={styles.cell}>{formatNumber(entry.value)} {calculation.unit}</Text>
            <Text style={styles.cell}>{formatNumber(runningTotal(calculation.entries, index))}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>TỔNG</Text>
        <Text style={styles.total}>{formatNumber(calculation.total)} {calculation.unit}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.edit}
          onPress={() => router.push({
            pathname: "/calculator",
            params: {
              id: calculation.id,
              name: calculation.name,
              date: calculation.date,
              food: calculation.food,
              unit: calculation.unit,
              note: calculation.note,
              entries: JSON.stringify(calculation.entries)
            }
          })}
        >
          <Ionicons name="create-outline" size={19} color={colors.rosePink} />
          <Text style={styles.editText}>Chỉnh sửa</Text>
        </Pressable>

        <Pressable
          style={styles.delete}
          onPress={() => Alert.alert("Xóa bảng tính", "Bạn có chắc muốn xóa bảng tính này?", [
            { text: "Hủy", style: "cancel" },
            { text: "Xóa", style: "destructive", onPress: async () => {
              await deleteCalculation(calculation.id);
              router.replace("/history");
            }}
          ])}
        >
          <Ionicons name="trash-outline" size={19} color={colors.magenta} />
          <Text style={styles.deleteText}>Xóa</Text>
        </Pressable>
      </View>
    </Page>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: { backgroundColor: "#fff", borderRadius: 17, padding: 16, gap: 11, ...shadow },
  infoRow: { flexDirection: "row", gap: 8 },
  infoLabel: { width: 100, color: colors.textSoft, fontSize: 12 },
  infoValue: { flex: 1, color: colors.textStrong, fontSize: 13, fontWeight: "800" },
  table: { marginTop: 14, backgroundColor: "#fff", overflow: "hidden", borderRadius: 16, ...shadow },
  head: { minHeight: 48, backgroundColor: colors.surfaceMuted, flexDirection: "row", alignItems: "center" },
  headText: { flex: 1, textAlign: "center", color: colors.textStrong, fontSize: 10, fontWeight: "900" },
  row: { minHeight: 48, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", alignItems: "center" },
  cell: { flex: 1, textAlign: "center", color: colors.textStrong, fontSize: 11 },
  cellOperator: { flex: 1, textAlign: "center", color: colors.primary, fontSize: 18, fontWeight: "900" },
  totalCard: { marginTop: 13, padding: 15, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: "center" },
  totalLabel: { color: colors.primaryDark, fontSize: 11, fontWeight: "900" },
  total: { color: colors.primaryDark, fontSize: 25, fontWeight: "900", marginTop: 3 },
  actions: { flexDirection: "row", gap: 10, marginTop: 13 },
  edit: { flex: 1, minHeight: 51, borderRadius: 14, backgroundColor: colors.rosePinkSoft, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  editText: { color: colors.rosePink, fontWeight: "900" },
  delete: { flex: 1, minHeight: 51, borderRadius: 14, backgroundColor: colors.magentaSoft, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  deleteText: { color: colors.magenta, fontWeight: "900" },
  notFound: { paddingTop: 80, alignItems: "center" },
  notFoundText: { color: colors.textSoft }
});
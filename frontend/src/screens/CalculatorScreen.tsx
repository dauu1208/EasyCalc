import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import type { Entry, Operator } from "../types";
import { calculate, formatNumber, runningTotal } from "../utils/calculation";
import { colors, shadow } from "../theme";

const operators: { symbol: Operator; label: string; color: string }[] = [
  { symbol: "+", label: "Cộng", color: colors.primary },
  { symbol: "-", label: "Trừ", color: colors.magenta },
  { symbol: "×", label: "Nhân", color: colors.rosePink },
  { symbol: "÷", label: "Chia", color: colors.peach }
];

export default function CalculatorScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    date?: string;
    food?: string;
    unit?: string;
    note?: string;
    entries?: string;
  }>();

  const { saveCalculation, getCalculation } = useApp();
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (params.entries) {
      try { return JSON.parse(params.entries); } catch {}
    }
    return [{ id: Date.now(), operator: null, value: 0 }];
  });
  const [nextOperator, setNextOperator] = useState<Operator>("+");

  const total = useMemo(() => calculate(entries), [entries]);
  const unit = params.unit || "kg";

  function updateValue(id: number, value: string) {
    const numeric = Number(value);
    setEntries((current) =>
      current.map((item) => item.id === id
        ? { ...item, value: Number.isFinite(numeric) ? numeric : 0 }
        : item)
    );
  }

  function updateOperator(id: number, operator: Operator) {
    setEntries((current) => current.map((item) => item.id === id ? { ...item, operator } : item));
  }

  function addEntry() {
    setEntries((current) => [
      ...current,
      { id: Date.now(), operator: nextOperator, value: 0 }
    ]);
  }

  function removeEntry(id: number) {
    if (entries.length === 1) return;
    setEntries((current) => current.filter((item) => item.id !== id));
  }

  async function save() {
    if (!params.food || !params.name) {
      Alert.alert("Thiếu thông tin", "Vui lòng quay lại và nhập Tên người lập và Tên thực phẩm.");
      return;
    }

    if (!Number.isFinite(total)) {
      Alert.alert("Không thể lưu", "Phép chia cho 0 hoặc dữ liệu không hợp lệ.");
      return;
    }

    const calculation = {
      id: params.id || `calc-${Date.now()}`,
      name: params.name,
      date: params.date || new Date().toLocaleDateString("vi-VN"),
      food: params.food,
      unit,
      note: params.note || "",
      entries,
      total
    };

    await saveCalculation(calculation);
    router.replace({
      pathname: "/saved",
      params: { id: calculation.id, food: calculation.food, total: String(calculation.total), unit: calculation.unit }
    });
  }

  return (
    <Page>
      <PageHeader
        title={params.food || "Bảng tính"}
        subtitle={`${params.date || ""} · ${params.name || ""}`}
        back
      />

      <View style={styles.tableCard}>
        <View style={styles.head}>
          <Text style={styles.headText}>Lần</Text>
          <Text style={styles.headText}>Phép</Text>
          <Text style={styles.headText}>Số lượng</Text>
          <Text style={styles.headText}>Kết quả</Text>
          <View />
        </View>

        {entries.map((entry, index) => {
          const preview = runningTotal(entries, index);
          return (
            <View style={styles.row} key={entry.id}>
              <Text style={styles.index}>{index + 1}</Text>
              <View style={styles.operatorSelect}>
                {index === 0 ? (
                  <Text style={styles.firstOperator}>—</Text>
                ) : (
                  <View style={styles.operatorMiniRow}>
                    {operators.map((op) => (
                      <Pressable
                        key={op.symbol}
                        onPress={() => updateOperator(entry.id, op.symbol)}
                        style={[
                          styles.miniOp,
                          { backgroundColor: entry.operator === op.symbol ? op.color : colors.surfaceMuted }
                        ]}
                      >
                        <Text style={{ color: entry.operator === op.symbol ? "#fff" : colors.textSoft, fontWeight: "900" }}>
                          {op.symbol}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <TextInput
                style={styles.valueInput}
                keyboardType="decimal-pad"
                value={String(entry.value)}
                onChangeText={(text) => updateValue(entry.id, text)}
                selectTextOnFocus
              />
              <Text style={styles.result}>{formatNumber(preview)}</Text>
              {entries.length > 1 && (
                <Pressable style={styles.deleteRow} onPress={() => removeEntry(entry.id)}>
                  <Ionicons name="trash-outline" size={15} color={colors.magenta} />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Chọn phép tính cho lần tiếp theo</Text>
      <View style={styles.operatorGrid}>
        {operators.map((op) => (
          <Pressable
            key={op.symbol}
            style={[styles.operatorButton, { backgroundColor: op.color }, nextOperator === op.symbol && styles.selectedOperator]}
            onPress={() => setNextOperator(op.symbol)}
          >
            <Text style={styles.operatorSymbol}>{op.symbol}</Text>
            <Text style={styles.operatorLabel}>{op.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.addButton} onPress={addEntry}>
        <Ionicons name="add" size={21} color={colors.rosePink} />
        <Text style={styles.addText}>Thêm lần</Text>
      </Pressable>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>TỔNG</Text>
        <Text style={styles.totalValue}>{formatNumber(total)} {unit}</Text>
      </View>

      <Pressable style={styles.saveButton} onPress={save}>
        <Ionicons name="save-outline" size={21} color="#fff" />
        <Text style={styles.saveText}>Lưu</Text>
      </Pressable>
    </Page>
  );
}

const styles = StyleSheet.create({
  tableCard: { overflow: "hidden", backgroundColor: "#fff", borderRadius: 17, ...shadow },
  head: { minHeight: 48, backgroundColor: colors.surfaceMuted, flexDirection: "row", alignItems: "center", paddingHorizontal: 5 },
  headText: { flex: 1, textAlign: "center", color: colors.textStrong, fontSize: 10, fontWeight: "900" },
  row: { minHeight: 66, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: 5, position: "relative" },
  index: { flex: 0.7, textAlign: "center", fontWeight: "800", color: colors.textStrong },
  operatorSelect: { flex: 1.9, alignItems: "center" },
  firstOperator: { color: colors.muted, fontSize: 18 },
  operatorMiniRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 2, maxWidth: 88 },
  miniOp: { width: 20, height: 20, borderRadius: 5, alignItems: "center", justifyContent: "center" },
  valueInput: { flex: 2, height: 40, borderWidth: 1, borderColor: colors.borderInput, borderRadius: 9, textAlign: "center", color: colors.text, fontSize: 14 },
  result: { flex: 1.7, textAlign: "center", color: colors.textStrong, fontSize: 12, fontWeight: "800" },
  deleteRow: { position: "absolute", right: 2, top: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.magentaSoft, alignItems: "center", justifyContent: "center" },
  sectionLabel: { marginTop: 16, marginBottom: 9, color: colors.textStrong, fontSize: 13, fontWeight: "800" },
  operatorGrid: { flexDirection: "row", gap: 7 },
  operatorButton: { flex: 1, minHeight: 76, borderRadius: 14, alignItems: "center", justifyContent: "center", opacity: 0.8 },
  selectedOperator: { opacity: 1, borderWidth: 3, borderColor: "#fff" },
  operatorSymbol: { color: "#fff", fontSize: 28, fontWeight: "900" },
  operatorLabel: { color: "#fff", fontSize: 11, fontWeight: "900", marginTop: 4 },
  addButton: { minHeight: 50, marginTop: 12, borderRadius: 14, backgroundColor: colors.rosePinkSoft, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 },
  addText: { color: colors.rosePink, fontSize: 15, fontWeight: "900" },
  totalCard: { marginTop: 12, padding: 15, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: "center" },
  totalLabel: { color: colors.primaryDark, fontSize: 11, fontWeight: "900" },
  totalValue: { color: colors.primaryDark, fontSize: 25, fontWeight: "900", marginTop: 3 },
  saveButton: { minHeight: 54, marginTop: 13, borderRadius: 15, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "900" }
});
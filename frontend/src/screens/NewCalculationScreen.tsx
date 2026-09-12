import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import { colors, shadow } from "../theme";

export default function NewCalculationScreen() {
  const today = new Date().toLocaleDateString("vi-VN");
  const [name, setName] = useState("");
  const [date, setDate] = useState(today);
  const [food, setFood] = useState("");
  const [unit, setUnit] = useState("kg");
  const [note, setNote] = useState("");

  function start() {
    if (!name.trim() || !food.trim()) {
      alert("Vui lòng nhập Tên người lập và Tên thực phẩm.");
      return;
    }

    router.push({
      pathname: "/calculator",
      params: {
        name: name.trim(),
        date,
        food: food.trim(),
        unit,
        note: note.trim()
      }
    });
  }

  return (
    <Page>
      <PageHeader title="Tạo mới" back />

      <View style={styles.card}>
        <Field label="Tên người lập" icon="person-outline">
          <TextInput value={name} onChangeText={setName} placeholder="Ví dụ: Nguyễn Văn A" style={styles.input} />
        </Field>

        <Field label="Ngày" icon="calendar-outline">
          <TextInput value={date} onChangeText={setDate} placeholder="dd/mm/yyyy" style={styles.input} />
        </Field>

        <Field label="Tên thực phẩm" icon="restaurant-outline">
          <TextInput value={food} onChangeText={setFood} placeholder="Ví dụ: Gà" style={styles.input} />
        </Field>

        <View style={styles.field}>
          <Text style={styles.label}>Đơn vị</Text>
          <View style={styles.unitRow}>
            {["kg", "gram", "cái", "con"].map((item) => (
              <Pressable
                key={item}
                style={[styles.unit, unit === item && styles.unitSelected]}
                onPress={() => setUnit(item)}
              >
                <Text style={[styles.unitText, unit === item && styles.unitTextSelected]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ghi chú <Text style={styles.optional}>(không bắt buộc)</Text></Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Ví dụ: Cân gà buổi sáng..."
            style={[styles.input, styles.textarea]}
            multiline
          />
        </View>
      </View>

      <Pressable style={styles.start} onPress={start}>
        <Text style={styles.startText}>Bắt đầu</Text>
      </Pressable>
    </Page>
  );
}

function Field({
  label,
  icon,
  children
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <Ionicons name={icon} size={20} color={colors.rosePink} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 22, padding: 20, ...shadow },
  field: { marginBottom: 19 },
  label: { color: colors.textStrong, fontSize: 14, fontWeight: "800", marginBottom: 8 },
  optional: { color: colors.muted, fontWeight: "500" },
  inputBox: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 13,
    backgroundColor: "#fff"
  },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 11 },
  textarea: {
    minHeight: 92,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 13,
    padding: 12,
    textAlignVertical: "top"
  },
  unitRow: { flexDirection: "row", gap: 8 },
  unit: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  unitSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  unitText: { color: colors.textSoft, fontWeight: "800" },
  unitTextSelected: { color: "#fff" },
  start: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18
  },
  startText: { color: "#fff", fontSize: 17, fontWeight: "900" }
});
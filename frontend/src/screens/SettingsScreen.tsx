import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import BottomTabs from "../components/BottomTabs";
import { colors, shadow } from "../theme";

export default function SettingsScreen() {
  const [fontSize, setFontSize] = useState<"Nhỏ" | "Vừa" | "Lớn">("Vừa");
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);
  const [unit, setUnit] = useState("kg");

  return (
    <View style={styles.root}>
      <Page>
        <PageHeader title="Cài đặt" />

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Giao diện</Text>

          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Cỡ chữ</Text>
              <Text style={styles.itemSub}>Chọn kích thước dễ đọc</Text>
            </View>
            <View style={styles.fontOptions}>
              {(["Nhỏ", "Vừa", "Lớn"] as const).map((item) => (
                <Pressable key={item} style={[styles.fontOption, fontSize === item && styles.fontSelected]} onPress={() => setFontSize(item)}>
                  <Text style={[styles.fontText, fontSize === item && styles.fontTextSelected]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <SettingSwitch icon="moon-outline" title="Chế độ tối" subtitle="Giảm ánh sáng ban đêm" value={dark} onChange={setDark} />
          <SettingSwitch icon="volume-high-outline" title="Âm thanh" subtitle="Âm thanh khi bấm nút" value={sound} onChange={setSound} />

          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Đơn vị mặc định</Text>
              <Text style={styles.itemSub}>Đơn vị sử dụng khi tạo mới</Text>
            </View>
            <View style={styles.unitOptions}>
              {["kg", "gram", "cái", "con"].map((item) => (
                <Pressable key={item} style={[styles.unit, unit === item && styles.unitSelected]} onPress={() => setUnit(item)}>
                  <Text style={[styles.unitText, unit === item && styles.unitTextSelected]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Dữ liệu</Text>
          <Pressable style={styles.dataButton}><Text style={styles.dataText}>⬇️  Xuất dữ liệu</Text></Pressable>
          <Pressable style={styles.dataButton}><Text style={styles.dataText}>⬆️  Nhập dữ liệu</Text></Pressable>
        </View>

        <Text style={styles.version}>EasyCalc · Phiên bản 1.0.0</Text>
      </Page>
      <BottomTabs />
    </View>
  );
}

function SettingSwitch({
  icon,
  title,
  subtitle,
  value,
  onChange
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.item}>
      <View style={styles.settingLabel}>
        <Ionicons name={icon} size={20} color={colors.textSoft} />
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemSub}>{subtitle}</Text>
        </View>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: colors.muted, true: colors.primary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingBottom: 76 },
  group: { backgroundColor: "#fff", borderRadius: 17, overflow: "hidden", marginBottom: 14, ...shadow },
  groupTitle: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, color: colors.text, fontSize: 15, fontWeight: "900" },
  item: { minHeight: 70, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  itemTitle: { color: colors.text, fontSize: 14, fontWeight: "800" },
  itemSub: { color: colors.textSoft, fontSize: 11, marginTop: 3 },
  settingLabel: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  fontOptions: { flexDirection: "row", gap: 3, backgroundColor: colors.border, borderRadius: 10, padding: 4 },
  fontOption: { paddingVertical: 7, paddingHorizontal: 7, borderRadius: 7 },
  fontSelected: { backgroundColor: colors.primary },
  fontText: { color: colors.textSoft, fontSize: 10, fontWeight: "800" },
  fontTextSelected: { color: "#fff" },
  unitOptions: { flexDirection: "row", gap: 4 },
  unit: { paddingHorizontal: 9, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surfaceMuted },
  unitSelected: { backgroundColor: colors.primary },
  unitText: { color: colors.textSoft, fontSize: 11, fontWeight: "800" },
  unitTextSelected: { color: "#fff" },
  dataButton: { minHeight: 52, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: colors.border, justifyContent: "center" },
  dataText: { color: colors.textStrong, fontSize: 14, fontWeight: "800" },
  version: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 4 }
});
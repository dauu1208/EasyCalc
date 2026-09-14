import { Pressable, StyleSheet, View } from "react-native";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader";
import BottomTabs from "../components/BottomTabs";
import Text from "../components/AppText";
import { useSettings } from "../context/SettingsContext";
import { colors, shadow } from "../theme";

export default function SettingsScreen() {
  const { fontSize, setFontSize } = useSettings();

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
        </View>

        <Text style={styles.version}>EasyCalc · Phiên bản 1.0.0</Text>
      </Page>
      <BottomTabs />
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
  fontOptions: { flexDirection: "row", gap: 3, backgroundColor: colors.border, borderRadius: 10, padding: 4 },
  fontOption: { paddingVertical: 7, paddingHorizontal: 7, borderRadius: 7 },
  fontSelected: { backgroundColor: colors.primary },
  fontText: { color: colors.textSoft, fontSize: 10, fontWeight: "800" },
  fontTextSelected: { color: "#fff" },
  version: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 4 }
});

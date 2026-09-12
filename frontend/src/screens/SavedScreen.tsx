import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Page from "../components/Page";
import { colors } from "../theme";

export default function SavedScreen() {
  const params = useLocalSearchParams<{ id: string; food: string; total: string; unit: string }>();

  return (
    <Page>
      <View style={styles.page}>
        <Ionicons name="checkmark-circle" size={88} color={colors.primary} />
        <Text style={styles.title}>Đã lưu thành công!</Text>
        <Text style={styles.copy}>Bảng tính của bạn đã được lưu vào lịch sử.</Text>

        <Pressable style={styles.primary} onPress={() => router.replace(`/history/${params.id}`)}>
          <Text style={styles.primaryText}>Xem chi tiết</Text>
        </Pressable>

        <Pressable style={styles.secondary} onPress={() => router.replace("/")}>
          <Text style={styles.secondaryText}>Về trang chủ</Text>
        </Pressable>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingTop: 80 },
  title: { color: colors.text, fontSize: 27, fontWeight: "900", marginTop: 18, textAlign: "center" },
  copy: { color: colors.textSoft, fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 10, marginBottom: 28 },
  primary: { width: "100%", minHeight: 54, borderRadius: 15, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  secondary: { width: "100%", minHeight: 54, borderRadius: 15, backgroundColor: colors.surfaceMuted, alignItems: "center", justifyContent: "center", marginTop: 10 },
  secondaryText: { color: colors.textStrong, fontSize: 16, fontWeight: "900" }
});
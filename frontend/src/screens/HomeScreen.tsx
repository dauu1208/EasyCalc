import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../components/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabs from "../components/BottomTabs";
import { colors, shadow } from "../theme";

export default function HomeScreen() {
  const actions = [
    {
      title: "Tạo mới",
      subtitle: "Bắt đầu một bảng tính mới",
      icon: "add" as const,
      color: colors.primary,
      path: "/new"
    },
    {
      title: "Lịch sử",
      subtitle: "Xem lại các bảng đã lưu",
      icon: "time" as const,
      color: colors.rosePink,
      path: "/history"
    },
    {
      title: "Cài đặt",
      subtitle: "Tùy chỉnh ứng dụng",
      icon: "settings" as const,
      color: colors.mauve,
      path: "/settings"
    }
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>🥬🍗🐟</Text>
          <Text style={styles.eyebrow}>EASYCALC</Text>
          <Text style={styles.title}>Xin chào!</Text>
          <Text style={styles.copy}>
            Sổ tính toán đơn giản{"\n"}
            <Text style={styles.bold}>Dễ dùng · Dễ nhớ · Dễ kiểm tra</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          {actions.map((item) => (
            <Pressable
              key={item.title}
              style={({ pressed }) => [styles.action, { backgroundColor: item.color, opacity: pressed ? 0.9 : 1 }]}
              onPress={() => router.push(item.path as never)}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={30} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
      <BottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1, paddingHorizontal: 20, paddingBottom: 86 },
  hero: { alignItems: "center", paddingTop: 35, paddingBottom: 28 },
  emoji: { fontSize: 44, marginBottom: 10, letterSpacing: -7 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: "900", letterSpacing: 2 },
  title: { color: colors.text, fontSize: 34, fontWeight: "900", marginTop: 4 },
  copy: { color: colors.textSoft, fontSize: 15, lineHeight: 24, textAlign: "center", marginTop: 8 },
  bold: { color: colors.textStrong, fontWeight: "800" },
  actions: { gap: 14 },
  action: {
    minHeight: 82,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    ...shadow
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  actionTitle: { color: "#fff", fontSize: 19, fontWeight: "900" },
  actionSubtitle: { color: "#fff", fontSize: 12, opacity: 0.92, marginTop: 3 }
});
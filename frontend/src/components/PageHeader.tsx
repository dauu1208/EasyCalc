import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../theme";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, back = false, right }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {back && (
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={23} color={colors.text} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  title: { color: colors.text, fontSize: 25, fontWeight: "800" },
  subtitle: { color: colors.textSoft, fontSize: 12, marginTop: 2 }
});
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Text from "./AppText";
import { colors } from "../theme";

export default function PrimaryButton({
  title,
  onPress,
  icon
}: {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      {icon ? <Ionicons name={icon} size={21} color="#fff" /> : null}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 16
  } as ViewStyle,
  text: { color: "#fff", fontSize: 17, fontWeight: "800" }
});
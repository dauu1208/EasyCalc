import { Text as RNText, StyleSheet, type TextProps } from "react-native";
import { FONT_SCALES, useSettings } from "../context/SettingsContext";

export default function Text({ style, ...rest }: TextProps) {
  const { fontSize } = useSettings();
  const scale = FONT_SCALES[fontSize];

  const flat = StyleSheet.flatten(style) || {};
  const scaledStyle =
    typeof flat.fontSize === "number"
      ? [style, { fontSize: flat.fontSize * scale }]
      : style;

  return <RNText style={scaledStyle} {...rest} />;
}

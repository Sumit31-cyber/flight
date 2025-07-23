import { Platform, StyleSheet, Text, TextStyle } from "react-native";
import React, { FC } from "react";
import { RFValue } from "react-native-responsive-fontsize";
// import { FONTS } from "utils/constants";

interface CustomTextProps {
  variant: Variant;
  // fontFamily?:
  //   | "gilroyRegular"
  //   | "gilroyBold"
  //   | "gilroyLight"
  //   | "gilroySemiBold"
  //   | "gilroyThin"
  //   | "gilroyExtraBold"
  //   | "gilroyMedium";
  fontSize?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: any) => void;
}
type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8";
type PlatformType = "ios" | "android";

export const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
  h1: { ios: 22, android: 24 },
  h2: { ios: 20, android: 22 },
  h3: { ios: 18, android: 20 },
  h4: { ios: 16, android: 18 },
  h5: { ios: 14, android: 16 },
  h6: { ios: 12, android: 14 },
  h7: { ios: 10, android: 12 },
  h8: { ios: 8, android: 10 },
};
const CustomText: FC<CustomTextProps> = ({
  variant,
  // fontFamily = FONTS.Regular,
  fontSize,
  color,
  children,
  style,
  numberOfLines,
  onLayout,
  ...props
}) => {
  let computedFontSize =
    Platform.OS === "android"
      ? RFValue(fontSize || 12)
      : RFValue(fontSize || 10);

  if (variant && fontSizeMap[variant]) {
    const defaultFontSize = fontSizeMap[variant][Platform.OS as PlatformType];
    computedFontSize = RFValue(fontSize || defaultFontSize);
  }

  // const fontFamilyStyle = {
  //   fontFamily,
  // };
  return (
    <Text
      onLayout={onLayout}
      style={[
        styles.text,
        { color: color || "black", fontSize: computedFontSize },
        // fontFamilyStyle,
        style,
      ]}
      numberOfLines={numberOfLines != undefined ? numberOfLines : undefined}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {},
});

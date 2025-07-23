import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const COLORS = {
  darkBackground: "#0c0c0c",
};

export const screenHeight = Dimensions.get("screen").height;
export const screenWidth = Dimensions.get("screen").width;
export const BORDER_WIDTH = StyleSheet.hairlineWidth * 2;
export const HEADER_HEIGHT = RFValue(40);
export const PADDING = RFValue(8);

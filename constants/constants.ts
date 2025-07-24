import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const COLORS = {
  darkBackground: "#0c0c0c",
  gray: "#3d3d3d",
  liteGray: "#1C1C1C",
};

export const screenHeight = Dimensions.get("screen").height;
export const screenWidth = Dimensions.get("screen").width;
export const BORDER_WIDTH = StyleSheet.hairlineWidth * 2;
export const HEADER_HEIGHT = RFValue(40);
export const PADDING = RFValue(8);

export const seatColumns = ["A", "B", "C", "D", "E", "F"];

export const occupiedSeats = new Set([
  "1A",
  "1B",
  "3C",
  "4D",
  "5E",
  "7B",
  "9A",
  "12C",
  "15D",
  "16E",
  "17F",
  "19B",
  "22D",
  "26A",
  "27C",
  "28E",
  "29F",
]);

export const unavailableSeats = new Set([
  "16A",
  "16B",
  "16C",
  "16D",
  "16E",
  "16F",
  "17A",
  "17B",
  "17C",
  "17D",
  "17E",
  "19A",
  "19C",
  "19D",
  "19E",
  "19F",
  "22A",
  "22B",
  "22C",
  "22E",
  "22F",
  "26B",
  "26C",
  "26D",
  "26E",
  "26F",
  "27A",
  "27B",
  "27D",
  "27E",
  "27F",
]);

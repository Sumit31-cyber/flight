import { StyleSheet, View, ViewStyle } from "react-native";
import React from "react";
import { COLORS } from "@/constants/constants";

const DashedLine = ({ style }: { style?: ViewStyle }) => {
  return (
    <View
      style={[
        {
          height: 1,
          width: "100%",
          borderRadius: 1,
          borderWidth: 1,
          borderColor: COLORS.darkBackground,
          borderStyle: "dashed",
          zIndex: 0,
        },
        style,
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 1,
          backgroundColor: "white",
          zIndex: 1,
        }}
      />
    </View>
  );
};

export default DashedLine;

const styles = StyleSheet.create({});

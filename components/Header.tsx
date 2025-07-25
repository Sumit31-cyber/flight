import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { HEADER_HEIGHT } from "@/constants/constants";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import CustomText from "./customText";

const Header = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        height: HEADER_HEIGHT,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft color={"white"} />
      </TouchableOpacity>
      <CustomText variant="h6" color="white">
        {title}
      </CustomText>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});

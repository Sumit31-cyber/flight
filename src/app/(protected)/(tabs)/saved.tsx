import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, PADDING } from "@/constants/constants";
import Header from "@/components/Header";

const Saved = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.darkBackground }}>
      <View style={{ paddingHorizontal: PADDING }}>
        <Header title="Saved" />
      </View>
    </SafeAreaView>
  );
};

export default Saved;

const styles = StyleSheet.create({});

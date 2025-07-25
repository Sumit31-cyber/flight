import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { COLORS, PADDING } from "@/constants/constants";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import FlightCard from "@/components/FlightCard";
import { clearMyFlights } from "@/redux/slice/sharedSlice";
import { router } from "expo-router";

const Flights = () => {
  const { myFlights } = useSelector((state: RootState) => state.shared);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(clearMyFlights());
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.darkBackground }}>
      <View style={{ paddingHorizontal: PADDING, flex: 1 }}>
        <Header title="Flights" />

        <View style={{ flex: 1 }}>
          {myFlights && (
            <FlatList
              data={myFlights}
              renderItem={({ item }) => {
                return (
                  <FlightCard
                    flightData={item}
                    onPress={() => {
                      router.navigate({
                        pathname: "/(screens)/yourFlightDetail",
                        params: {
                          flightData: JSON.stringify(item),
                        },
                      });
                    }}
                  />
                );
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Flights;

const styles = StyleSheet.create({});

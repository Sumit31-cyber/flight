import CustomText from "@/components/customText";
import DashedLine from "@/components/DashedLine";
import { BORDER_WIDTH, COLORS, PADDING } from "@/constants/constants";
import { setDepartingFrom, setFlyingTo } from "@/redux/slice/sharedSlice";
import { RootState } from "@/redux/store";
import { formatDate } from "@/utils/sharedFunctions";

import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowDownUp, Bell, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const [tripType, setTripType] = useState("oneway");

  const { departingFrom, flyingTo, departureDate, returnDate, travelers } =
    useSelector((state: RootState) => state.shared);

  const dispatch = useDispatch();

  const switchDestination = () => {
    dispatch(setDepartingFrom(flyingTo));
    dispatch(setFlyingTo(departingFrom));
  };

  const navigateToSearchAirport = (value: "from" | "to") => {
    router.navigate({
      pathname: "/(screens)/searchAirport",
      params: { value },
    });
  };

  const navigateToDatePicker = () => {
    router.navigate({
      pathname: "/(screens)/datePicker",
      params: {
        tripType,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.darkBackground}
      />

      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationTag}>
            <MapPin size={RFValue(14)} color={"white"} />
            <CustomText variant="h7" style={styles.locationText}>
              Surabaya
            </CustomText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Bell size={RFValue(14)} color={"white"} />
            </TouchableOpacity>
            <View style={styles.profileImage}>
              <Image
                source={{
                  uri: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
                }}
                style={styles.profileImg}
              />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <CustomText variant="h7" style={styles.subtitle}>
            Are you going on another overseas trip?
          </CustomText>
          <CustomText variant="h3" style={styles.title}>
            Buy Your Ticket Here!
          </CustomText>

          <View style={styles.bookingForm}>
            <View style={styles.tripTypeContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tripTypeBtn,
                  tripType === "oneway"
                    ? styles.tripTypeBtnActive
                    : styles.tripTypeBtnInactive,
                ]}
                onPress={() => setTripType("oneway")}
              >
                <CustomText
                  variant="h7"
                  color="white"
                  style={[styles.tripTypeBtnText]}
                >
                  One way
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tripTypeBtn,
                  tripType === "roundtrip"
                    ? styles.tripTypeBtnActive
                    : styles.tripTypeBtnInactive,
                ]}
                onPress={() => setTripType("roundtrip")}
              >
                <CustomText
                  variant="h7"
                  style={[
                    styles.tripTypeBtnText,
                    tripType === "roundtrip"
                      ? styles.tripTypeBtnTextWhite
                      : styles.tripTypeBtnTextInactive,
                  ]}
                >
                  Round Trip
                </CustomText>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={switchDestination}
                style={{
                  height: RFValue(30),
                  aspectRatio: 1,
                  borderRadius: 100,
                  position: "absolute",
                  backgroundColor: COLORS.liteGray,
                  zIndex: 1,
                  right: RFValue(10),
                  top: RFValue(34),
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: BORDER_WIDTH,
                  borderColor: "#ffffff30",
                }}
              >
                <ArrowDownUp size={RFValue(12)} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigateToSearchAirport("from")}
                style={{
                  backgroundColor: COLORS.darkBackground,
                  padding: PADDING,
                  paddingHorizontal: PADDING * 2,
                  borderRadius: 100,
                  gap: 4,
                  height: RFValue(45),
                  justifyContent: "center",
                }}
              >
                {!departingFrom ? (
                  <CustomText
                    color="white"
                    variant="h6"
                    style={{ opacity: 0.4 }}
                  >
                    Departing From
                  </CustomText>
                ) : (
                  <>
                    <CustomText
                      color="white"
                      variant="h8"
                      style={{ opacity: 0.4 }}
                    >
                      From
                    </CustomText>
                    <CustomText variant="h7" color="white">
                      {departingFrom.presentation.suggestionTitle}
                    </CustomText>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigateToSearchAirport("to")}
                style={{
                  padding: PADDING,
                  paddingHorizontal: PADDING * 2,
                  borderRadius: 100,
                  gap: 4,
                  height: RFValue(45),
                  justifyContent: "center",
                  backgroundColor: COLORS.darkBackground,
                }}
              >
                {!flyingTo ? (
                  <CustomText
                    color="white"
                    variant="h6"
                    style={{ opacity: 0.4 }}
                  >
                    Flying to
                  </CustomText>
                ) : (
                  <>
                    <CustomText
                      color="white"
                      variant="h8"
                      style={{ opacity: 0.4 }}
                    >
                      To
                    </CustomText>
                    <CustomText color="white" variant="h7">
                      {flyingTo.presentation.suggestionTitle}
                    </CustomText>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* DIVIDER */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: 30,
                  aspectRatio: 1,
                  backgroundColor: COLORS.darkBackground,
                  borderRadius: 100,
                }}
              ></View>
              <DashedLine
                backgroundColor={COLORS.liteGray}
                style={{
                  borderColor: "#ced4da",
                  marginVertical: RFValue(14),
                  marginHorizontal: 2,
                }}
              />
              <View
                style={{
                  height: 30,
                  aspectRatio: 1,
                  backgroundColor: COLORS.darkBackground,
                  borderRadius: 100,
                }}
              ></View>
            </View>

            {/* Flight Info */}

            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", flex: 1, gap: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={navigateToDatePicker}
                  style={{
                    backgroundColor: COLORS.darkBackground,
                    padding: PADDING,
                    paddingHorizontal: PADDING * 2,
                    borderRadius: 100,
                    gap: 4,
                    flex: 1,
                  }}
                >
                  <CustomText
                    variant="h8"
                    color="white"
                    style={{ opacity: 0.4 }}
                  >
                    Departure Date
                  </CustomText>
                  <CustomText color="white" variant="h7">
                    {formatDate(departureDate)}
                  </CustomText>
                </TouchableOpacity>
                {tripType === "roundtrip" && (
                  <TouchableOpacity
                    onPress={navigateToDatePicker}
                    style={{
                      backgroundColor: COLORS.darkBackground,
                      padding: PADDING,
                      paddingHorizontal: PADDING * 2,
                      borderRadius: 100,
                      gap: 4,
                      flex: 1,
                    }}
                  >
                    <CustomText
                      variant="h8"
                      color="white"
                      style={{ opacity: 0.4 }}
                    >
                      Return Date
                    </CustomText>
                    <CustomText variant="h7" color="white">
                      {formatDate(returnDate)}
                    </CustomText>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ flexDirection: "row", flex: 1, gap: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={navigateToDatePicker}
                  style={{
                    backgroundColor: COLORS.darkBackground,
                    padding: PADDING,
                    paddingHorizontal: PADDING * 2,
                    borderRadius: 100,
                    gap: 4,
                    flex: 1,
                  }}
                >
                  <CustomText
                    variant="h8"
                    color="white"
                    style={{ opacity: 0.4 }}
                  >
                    Passengers
                  </CustomText>
                  <CustomText variant="h7" color="white">
                    {travelers} Seats
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={navigateToDatePicker}
                  style={{
                    backgroundColor: COLORS.darkBackground,
                    padding: PADDING,
                    paddingHorizontal: PADDING * 2,
                    borderRadius: 100,
                    gap: 4,
                    flex: 1,
                  }}
                >
                  <CustomText
                    variant="h8"
                    color="white"
                    style={{ opacity: 0.4 }}
                  >
                    Seat Class
                  </CustomText>
                  <CustomText variant="h7" color="white">
                    Economy
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                router.navigate("/(screens)/searchFlightScreen");
                // router.navigate("/(screens)/flightSeatSelection");
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                backgroundColor: COLORS.darkBackground,
                padding: RFValue(12),
                marginTop: RFValue(10),
              }}
            >
              <CustomText variant="h6" color="white">
                Search Flight
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: PADDING,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  locationDot: {
    width: 8,
    height: 8,
    backgroundColor: "#666",
    borderRadius: 4,
    marginRight: 8,
  },
  locationText: {
    color: "white",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#333",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: PADDING,
    paddingTop: 16,
  },
  subtitle: {
    color: "#999",
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    marginBottom: RFValue(10),
  },
  bookingForm: {
    backgroundColor: COLORS.liteGray,
    borderRadius: RFValue(20),
    padding: PADDING,
  },
  tripTypeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  tripTypeBtn: {
    flex: 1,
    paddingVertical: PADDING,
    borderRadius: 100,
    borderWidth: BORDER_WIDTH,
    alignItems: "center",
  },
  tripTypeBtnActive: {
    borderColor: "#fff",
    // backgroundColor: "white",
  },
  tripTypeBtnActiveBlack: {
    borderColor: "#000",
    backgroundColor: "#000",
  },
  tripTypeBtnInactive: {
    borderColor: COLORS.darkBackground,
    backgroundColor: COLORS.darkBackground,
  },
  tripTypeBtnText: {
    fontWeight: "500",
  },
  tripTypeBtnTextActive: {
    color: "#000",
  },
  tripTypeBtnTextWhite: {
    color: "white",
  },
  tripTypeBtnTextInactive: {
    color: "#fff",
    opacity: 0.6,
  },
});

export default Home;

import CustomText from "@/components/customText";
import DashedLine from "@/components/DashedLine";
import { BORDER_WIDTH, COLORS, PADDING } from "@/constants/constants";
import { Image } from "expo-image";
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

const Home = () => {
  const [tripType, setTripType] = useState("roundtrip");
  const [fromLocation, setFromLocation] = useState("Surabaya, East Java (SBY)");
  const [toLocation, setToLocation] = useState("Denpasar, Bali (DPS)");

  const switchDestination = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
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
            <Text style={styles.locationText}>Surabaya</Text>
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
                <Text
                  style={[
                    styles.tripTypeBtnText,
                    tripType === "oneway"
                      ? styles.tripTypeBtnTextActive
                      : styles.tripTypeBtnTextInactive,
                  ]}
                >
                  One way
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tripTypeBtn,
                  tripType === "roundtrip"
                    ? styles.tripTypeBtnActiveBlack
                    : styles.tripTypeBtnInactive,
                ]}
                onPress={() => setTripType("roundtrip")}
              >
                <Text
                  style={[
                    styles.tripTypeBtnText,
                    tripType === "roundtrip"
                      ? styles.tripTypeBtnTextWhite
                      : styles.tripTypeBtnTextInactive,
                  ]}
                >
                  Round Trip
                </Text>
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
                  backgroundColor: COLORS.darkBackground,
                  zIndex: 1,
                  right: RFValue(10),
                  top: RFValue(34),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArrowDownUp size={RFValue(12)} color={"white"} />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#f3f2f7",
                  padding: PADDING,
                  paddingHorizontal: PADDING * 2,
                  borderRadius: 100,
                  gap: 4,
                }}
              >
                <CustomText variant="h8" style={{ opacity: 0.4 }}>
                  From
                </CustomText>
                <CustomText variant="h7">{fromLocation}</CustomText>
              </View>
              <View
                style={{
                  backgroundColor: "#f3f2f7",
                  padding: PADDING,
                  paddingHorizontal: PADDING * 2,
                  borderRadius: 100,
                  gap: 4,
                }}
              >
                <CustomText variant="h8" style={{ opacity: 0.4 }}>
                  To
                </CustomText>
                <CustomText variant="h7">{toLocation}</CustomText>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: 20,
                  aspectRatio: 1,
                  backgroundColor: COLORS.darkBackground,
                  borderRadius: 100,
                }}
              ></View>
              <DashedLine
                style={{
                  marginVertical: RFValue(14),
                  borderColor: "#ced4da",
                  marginHorizontal: 2,
                }}
              />
              <View
                style={{
                  height: 20,
                  aspectRatio: 1,
                  backgroundColor: COLORS.darkBackground,
                  borderRadius: 100,
                }}
              ></View>
            </View>

            {/* Today's Flight Section */}
            {/* <View style={styles.todayFlightSection}>
            <View style={styles.todayFlightHeader}>
              <Text style={styles.todayFlightTitle}>Today's Flight</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.flightCard}>
              <View style={styles.airlineBadge}>
                <Text style={styles.airlineBadgeText}>Citilink</Text>
              </View>
              <View style={styles.flightInfo}>
                <Text style={styles.airlineName}>Lion Air</Text>
                <Text style={styles.flightDate}>20 December 2023</Text>
              </View>
            </View>*/}
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
    fontSize: 14,
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
    backgroundColor: "white",
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
    borderColor: "#000",
    backgroundColor: "white",
  },
  tripTypeBtnActiveBlack: {
    borderColor: "#000",
    backgroundColor: "#000",
  },
  tripTypeBtnInactive: {
    borderColor: "#ddd",
    backgroundColor: "#f3f2f7",
  },
  tripTypeBtnText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tripTypeBtnTextActive: {
    color: "#000",
  },
  tripTypeBtnTextWhite: {
    color: "white",
  },
  tripTypeBtnTextInactive: {
    color: "#666",
  },
});

export default Home;

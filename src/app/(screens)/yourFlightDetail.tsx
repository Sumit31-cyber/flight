import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { ArrowLeft, Plane } from "lucide-react-native";
import { Itinerary } from "@/utils/types";
import { router, useLocalSearchParams } from "expo-router";
import { COLORS, HEADER_HEIGHT, PADDING } from "@/constants/constants";
import CustomText from "@/components/customText";
import { Image } from "expo-image";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "@/utils/sharedFunctions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DashedLine from "@/components/DashedLine";
import { setMyFlights } from "@/redux/slice/sharedSlice";

const YourFlightDetail = () => {
  const { flightData } = useLocalSearchParams<{ flightData: string }>();
  const { departureDate, flyingTo, departingFrom } = useSelector(
    (state: RootState) => state.shared
  );

  const dispatch = useDispatch();

  const parsedFlightData: Itinerary = JSON.parse(
    decodeURIComponent(flightData)
  );

  const leg = parsedFlightData.legs[0];
  const carrier = leg.carriers.marketing[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ padding: PADDING, flex: 1 }}>
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
            Your flight details
          </CustomText>
        </View>
        <ScrollView style={{ flex: 1 }}>
          {/* Flight Card */}
          <View style={styles.flightCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  height: RFValue(30),
                  aspectRatio: 1,
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <Image source={{ uri: carrier.logoUrl }} style={{ flex: 1 }} />
              </View>
              <CustomText
                variant="h7"
                style={{ marginLeft: 10, color: "white" }}
              >
                {carrier.name}
              </CustomText>
              <CustomText
                variant={"h7"}
                style={{ marginLeft: "auto", color: "white" }}
              >
                {carrier.id}
              </CustomText>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingVertical: RFValue(20),
                paddingHorizontal: PADDING,
                borderRadius: 20,
                marginVertical: PADDING,
              }}
            >
              <View style={{ flex: 1 }}>
                <CustomText variant="h4" color="white">
                  {departingFrom?.skyId}
                </CustomText>
                <CustomText variant="h7" color="white" style={{ opacity: 0.8 }}>
                  {departingFrom?.navigation.localizedName},
                  {departingFrom?.presentation.subtitle}
                </CustomText>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  flex: 1,
                }}
              >
                <View style={{ width: RFValue(90) }}>
                  <DashedLine
                    backgroundColor={COLORS.liteGray}
                    style={{
                      borderColor: "#ced4da",
                    }}
                  />
                  <View
                    style={{
                      height: 20,
                      aspectRatio: 1,
                      borderRadius: 100,
                      backgroundColor: "white",
                      position: "absolute",
                      alignSelf: "center",
                      top: -8,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View style={{ transform: [{ rotate: "90deg" }] }}>
                      <MaterialIcons
                        name="flight"
                        size={RFValue(10)}
                        color={"black"}
                      />
                    </View>
                  </View>
                </View>
                <CustomText
                  variant="h8"
                  color="white"
                  style={{ marginTop: 14, opacity: 0.6 }}
                >
                  {formatDate(departureDate)}
                </CustomText>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  flex: 1,
                }}
              >
                <CustomText variant="h4" color="white">
                  {flyingTo?.skyId}
                </CustomText>
                <CustomText
                  variant="h7"
                  color="white"
                  style={{ opacity: 0.8, flex: 1 }}
                  numberOfLines={1}
                >
                  {flyingTo?.navigation.localizedName},
                  {flyingTo?.presentation.subtitle}
                </CustomText>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: PADDING,
              }}
            >
              <View
                style={{
                  height: 30,
                  aspectRatio: 1,
                  borderRadius: 100,
                  backgroundColor: COLORS.darkBackground,
                }}
              ></View>
              <DashedLine
                backgroundColor={COLORS.liteGray}
                style={{
                  borderColor: "#ced4da",
                }}
              />
              <View
                style={{
                  height: 30,
                  aspectRatio: 1,
                  borderRadius: 100,
                  backgroundColor: COLORS.darkBackground,
                }}
              ></View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: PADDING,
              }}
            >
              <View style={{}}>
                <CustomText variant="h8" color="white">
                  TERMINAL
                </CustomText>
                <CustomText variant="h7" color="white">
                  2A
                </CustomText>
              </View>
              <View style={{}}>
                <CustomText variant="h8" color="white">
                  Gate
                </CustomText>
                <CustomText variant="h7" color="white">
                  19
                </CustomText>
              </View>
              <View style={{}}>
                <CustomText variant="h8" color="white">
                  Class
                </CustomText>
                <CustomText variant="h7" color="white">
                  Economy
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.flightCard}>
            <CustomText variant="h6" color="white">
              Passengers Info
            </CustomText>
            <View
              style={{
                gap: 10,
                marginTop: RFValue(15),
                marginVertical: PADDING,
              }}
            >
              <UserCard
                title={"PASSENGER 1"}
                image={
                  "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                }
                name={"Mr. Someone"}
              />
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: COLORS.gray,
                }}
              ></View>
              <UserCard
                title={"PASSENGER 1"}
                image={
                  "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
                }
                name={"Mrs. Someone"}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginVertical: PADDING,
              }}
            >
              <View
                style={{
                  height: 30,
                  aspectRatio: 1,
                  borderRadius: 100,
                  backgroundColor: COLORS.darkBackground,
                }}
              ></View>
              <DashedLine
                backgroundColor={COLORS.liteGray}
                style={{
                  borderColor: "#ced4da",
                }}
              />
              <View
                style={{
                  height: 30,
                  aspectRatio: 1,
                  borderRadius: 100,
                  backgroundColor: COLORS.darkBackground,
                }}
              ></View>
            </View>
            {/* Barcode */}
            <View style={styles.barcodeSection}>
              <View style={styles.barcode}>
                {Array.from({ length: 40 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.barcodeLine,
                      { width: Math.random() > 0.5 ? 0.5 : 2 },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Download Button */}
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>Download & Save pass</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const UserCard = ({
  title,
  image,
  name,
}: {
  title: string;
  image: string;
  name: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 50,
          aspectRatio: 1,
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
        <Image
          source={{
            uri: image,
          }}
          style={{ flex: 1 }}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <CustomText
          variant="h8"
          color="white"
          style={{ letterSpacing: 0.8, opacity: 0.6 }}
        >
          {title}
        </CustomText>
        <CustomText variant="h7" color="white">
          {name}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  flightCard: {
    backgroundColor: COLORS.liteGray,
    borderRadius: 20,
    padding: PADDING,
    marginBottom: PADDING,
  },
  airlineSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  airlineLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#A8E6A3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  airlineLogoText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2E7D32",
  },
  airlineInfo: {
    flex: 1,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  flightId: {
    fontSize: 14,
    color: "#666",
  },
  routeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  departureInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  arrivalInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  time: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 5,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  cityName: {
    fontSize: 14,
    color: "#666",
  },
  flightDuration: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  duration: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginBottom: 20,
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  passengersSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  passengerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  passengerAvatar: {
    marginRight: 15,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  passengerInfo: {
    flex: 1,
  },
  passengerLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  seatInfo: {
    alignItems: "center",
  },
  seatLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  seatNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  barcodeSection: {
    alignItems: "center",
  },
  barcode: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    gap: 4,
    marginVertical: 10,
  },
  barcodeLine: {
    height: "100%",
    backgroundColor: "white",
    marginHorizontal: 0.5,
    opacity: 0.9,
  },
  downloadButton: {
    backgroundColor: COLORS.liteGray,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: "#000",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default YourFlightDetail;

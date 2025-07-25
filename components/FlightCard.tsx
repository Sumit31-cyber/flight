import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Itinerary } from "@/utils/types";
import { router } from "expo-router";
import { Image } from "expo-image";
import CustomText from "./customText";
import { formatDate } from "@/utils/sharedFunctions";
import DashedLine from "./DashedLine";
import { COLORS } from "@/constants/constants";
import { RFValue } from "react-native-responsive-fontsize";

const FlightCard = ({
  flightData,
  onPress,
}: {
  flightData: Itinerary;
  onPress: () => void;
}) => {
  const leg = flightData.legs[0];
  const carrier = leg.carriers.marketing[0];

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Helper function to get stop info
  const getStopInfo = (stopCount: number) => {
    if (stopCount === 0) return "Non-stop";
    if (stopCount === 1) return "1 stop";
    return `${stopCount} stops`;
  };

  return (
    <TouchableOpacity
      style={styles.flightCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Header with airline info and price */}
      <View style={styles.flightHeader}>
        <View style={styles.airlineInfo}>
          <Image
            source={{ uri: carrier.logoUrl }}
            style={styles.airlineLogo}
            contentFit="contain"
          />
          <CustomText variant="h7" color="white" style={{ flex: 1 }}>
            {carrier.name}
          </CustomText>
        </View>
        <View style={styles.priceContainer}>
          <CustomText variant="h6" style={styles.price}>
            {flightData.price.formatted}
          </CustomText>
          {flightData.tags && flightData.tags.includes("cheapest") && (
            <View style={styles.tag}>
              <CustomText variant="h8" style={styles.tagText}>
                Cheapest
              </CustomText>
            </View>
          )}
        </View>
      </View>

      {/* Flight details */}
      <View style={styles.flightDetails}>
        <View style={styles.timeContainer}>
          <CustomText variant="h6" style={styles.time}>
            {formatTime(leg.departure)}
          </CustomText>
          <CustomText variant="h7" style={styles.airport}>
            {leg.origin.displayCode}
          </CustomText>
          <CustomText variant="h8" style={styles.city}>
            {leg.origin.city}
          </CustomText>
        </View>

        <View style={styles.flightPath}>
          <CustomText variant="h8" style={styles.duration}>
            {formatDuration(leg.durationInMinutes)}
          </CustomText>
          <View style={styles.pathLine}>
            <View style={styles.dot} />
            <DashedLine style={{ borderColor: COLORS.gray }} />
            <View style={styles.dot} />
          </View>
          <CustomText variant="h8" style={styles.stops}>
            {getStopInfo(leg.stopCount)}
          </CustomText>
        </View>

        <View style={styles.timeContainer}>
          <CustomText variant="h6" style={styles.time}>
            {formatTime(leg.arrival)}
          </CustomText>
          <CustomText variant="h7" style={styles.airport}>
            {leg.destination.displayCode}
          </CustomText>
          <CustomText variant="h8" style={styles.city}>
            {leg.destination.city}
          </CustomText>
        </View>
      </View>

      {/* Additional info */}
      {leg.stopCount > 0 && leg.segments && (
        <View>
          <DashedLine
            backgroundColor={COLORS.liteGray}
            style={{
              borderColor: "#ced4da",
              marginVertical: RFValue(10),
              opacity: 0.4,
            }}
          />
          <CustomText variant="h8" style={styles.segmentText}>
            Via {leg.segments[0].destination.name}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FlightCard;

const styles = StyleSheet.create({
  flightCard: {
    backgroundColor: COLORS.liteGray,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  airlineInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  airlineLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontWeight: "bold",
    color: "#2196F3",
  },
  tag: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  tagText: {
    color: "#fff",
    fontWeight: "bold",
  },
  flightDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeContainer: {
    alignItems: "center",
    flex: 1,
  },
  time: {
    fontWeight: "bold",
    color: "white",
  },
  airport: {
    marginTop: 2,
    opacity: 0.8,
    color: "white",
  },
  city: {
    color: "white",
    marginTop: 1,
    opacity: 0.8,
  },
  flightPath: {
    alignItems: "center",
    flex: 2,
    paddingHorizontal: 16,
  },
  duration: {
    color: "white",
    marginBottom: 4,
  },
  pathLine: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2196F3",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  stops: {
    marginTop: 2,
    color: "white",
    opacity: 0.8,
  },

  segmentText: {
    color: "white",
    textAlign: "center",
  },
});

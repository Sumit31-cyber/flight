import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { RootState } from "@/redux/store";
import { formatDate } from "@/utils/sharedFunctions";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import CustomText from "@/components/customText";
import DashedLine from "@/components/DashedLine";
import {
  COLORS,
  HEADER_HEIGHT,
  occupiedSeats,
  PADDING,
  screenHeight,
  seatColumns,
  unavailableSeats,
} from "@/constants/constants";
import { Itinerary } from "@/utils/types";
import { setMyFlights } from "@/redux/slice/sharedSlice";

const SEAT_SIZE = RFValue(32);

const FlightSeatSelection = () => {
  const { flightData } = useLocalSearchParams<{ flightData: string }>();
  const parsedFlightData: Itinerary = JSON.parse(flightData);
  const dispatch = useDispatch();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { departingFrom, flyingTo, departureDate, returnDate, travelers } =
    useSelector((state: RootState) => state.shared);

  const seatRows = 29;
  const getSeatStatus = (row: string, col: string) => {
    const seatId = `${row}${col}`;
    if (occupiedSeats.has(seatId)) return "occupied";
    if (unavailableSeats.has(seatId)) return "unavailable";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  const handleSeatSelect = (row: string, col: string) => {
    const seatId = `${row}${col}`;
    const status = getSeatStatus(row, col);

    if (status === "available") {
      if (selectedSeats.length < travelers) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    } else if (status === "selected") {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
    }
  };

  const getSeatStyle = (status: string) => {
    switch (status) {
      case "selected":
        return [styles.seat, styles.selectedSeat];
      case "occupied":
        return [styles.seat, styles.occupiedSeat];
      case "unavailable":
        return [styles.seat, styles.unavailableSeat];
      default:
        return [styles.seat, styles.availableSeat];
    }
  };

  const getSeatTextStyle = (status: string) => {
    switch (status) {
      case "selected":
        return styles.selectedSeatText;
      case "occupied":
        return styles.occupiedSeatText;
      case "unavailable":
        return styles.unavailableSeatText;
      default:
        return styles.availableSeatText;
    }
  };

  const renderSeat = (row: string, col: string) => {
    const status = getSeatStatus(row, col);
    const isDisabled = status === "occupied" || status === "unavailable";

    return (
      <TouchableOpacity
        key={`${row}${col}`}
        style={getSeatStyle(status)}
        onPress={() => handleSeatSelect(row, col)}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.7}
      >
        <Text style={getSeatTextStyle(status)}>{row}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.darkBackground }}>
      <ScrollView>
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
              Choose Seat
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginVertical: PADDING,
              backgroundColor: COLORS.liteGray,
              paddingVertical: RFValue(20),
              paddingHorizontal: PADDING,
              borderRadius: 20,
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

          <View style={styles.seatMapContainer}>
            <View style={styles.aircraftBody}>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSeat, styles.availableSeat]} />
                  <CustomText variant="h7" style={styles.legendText}>
                    Available
                  </CustomText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSeat, styles.selectedSeat]} />
                  <CustomText variant="h7" style={styles.legendText}>
                    Selected
                  </CustomText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSeat, styles.occupiedSeat]} />
                  <CustomText variant="h7" style={styles.legendText}>
                    Unavailable
                  </CustomText>
                </View>
              </View>

              <View
                style={[
                  styles.columnHeaders,
                  { gap: 10, marginLeft: SEAT_SIZE + 10 },
                ]}
              >
                {seatColumns.map((col) => (
                  <View
                    key={col}
                    style={{
                      width: SEAT_SIZE,

                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CustomText
                      variant="h7"
                      key={col}
                      style={styles.columnHeader}
                    >
                      {col}
                    </CustomText>
                  </View>
                ))}
              </View>

              <ScrollView
                style={styles.seatsScrollView}
                showsVerticalScrollIndicator={false}
              >
                {Array.from({ length: seatRows }, (_, i) => i + 1).map(
                  (row) => (
                    <View key={row} style={styles.seatRow}>
                      <CustomText variant="h7" style={styles.rowNumber}>
                        {row}
                      </CustomText>
                      <View style={styles.seatsInRow}>
                        {seatColumns.map((col) =>
                          renderSeat(row.toString(), col)
                        )}
                      </View>
                    </View>
                  )
                )}
              </ScrollView>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.passengerCard}>
              <View style={styles.passengerInfo}>
                <View>
                  <CustomText
                    variant="h7"
                    color="white"
                    style={{ opacity: 0.7 }}
                  >
                    Passengers
                  </CustomText>
                  <CustomText
                    variant="h7"
                    style={styles.passengerValue}
                    color="white"
                  >
                    2 Adults
                  </CustomText>
                </View>
              </View>
              <View>
                <CustomText variant="h7" style={styles.seatLabel}>
                  Seats
                </CustomText>
                <CustomText variant="h6" style={styles.seatValue}>
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </CustomText>
                <CustomText variant="h7" style={styles.seatCount}>
                  {selectedSeats.length}/{travelers} selected
                </CustomText>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.bookButton]}
              disabled={selectedSeats.length !== travelers}
              activeOpacity={0.8}
              onPress={() => {
                router.navigate({
                  pathname: "/(screens)/yourFlightDetail",
                  params: {
                    flightData: flightData,
                  },
                });

                dispatch(setMyFlights(parsedFlightData));
              }}
            >
              <CustomText variant="h4" style={[styles.bookButtonText]}>
                Book now
                {selectedSeats.length !== travelers &&
                  `(${selectedSeats.length}/${travelers})`}
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
  },

  seatMapContainer: {
    flex: 1,
  },
  aircraftBody: {
    backgroundColor: COLORS.liteGray,
    borderRadius: 30,
    padding: 20,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendSeat: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    color: "#666",
  },
  columnHeaders: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  columnHeader: {
    textAlign: "center",
    fontWeight: "500",
    color: "#666",
    marginHorizontal: 2,
  },
  seatsScrollView: {
    height: screenHeight * 0.3,
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  rowNumber: {
    width: SEAT_SIZE,
    alignSelf: "center",
    textAlign: "center",
    color: "#666",
    marginRight: 10,
  },
  seatsInRow: {
    flexDirection: "row",
    gap: 10,
  },
  seat: {
    width: SEAT_SIZE,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  availableSeat: {
    backgroundColor: COLORS.darkBackground,
    borderWidth: 1,
    // borderColor: "#fff",
  },
  selectedSeat: {
    backgroundColor: "#1FD860",
  },
  occupiedSeat: {
    backgroundColor: "#ffd56d",
  },
  unavailableSeat: {
    backgroundColor: "#d1d5db",
  },
  availableSeatText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  selectedSeatText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  occupiedSeatText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  unavailableSeatText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  bottomSection: {
    marginVertical: 20,
  },
  passengerCard: {
    backgroundColor: COLORS.liteGray,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  passengerValue: {
    fontWeight: "600",
  },
  seatLabel: {
    color: "white",
    textAlign: "right",
    opacity: 0.7,
  },
  seatValue: {
    fontWeight: "600",
    textAlign: "right",
    color: "white",
  },
  bookButton: {
    backgroundColor: COLORS.liteGray,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  seatCount: {
    color: "white",
    textAlign: "right",
    marginTop: 2,
    opacity: 0.7,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default FlightSeatSelection;

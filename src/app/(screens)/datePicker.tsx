import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { COLORS, PADDING } from "@/constants/constants";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setDepartureDate,
  setReturnDate,
  updateTravelerCount,
} from "@/redux/slice/sharedSlice";
import { formatDate } from "@/utils/sharedFunctions";
import { MarkedDates } from "react-native-calendars/src/types";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/customText";

const CABIN_CLASS = ["Economy", "Premium Economy", "Business", "First"];

const DatePicker = ({}) => {
  const params = useLocalSearchParams();
  const isOneWay = params.tripType === "oneway";

  const [isSelectingDeparture, setIsSelectingDeparture] = useState(true);

  const { departureDate, returnDate, travelers } = useSelector(
    (state: RootState) => state.shared
  );

  const dispatch = useDispatch();

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Pre-populate departure date with today's date if not selected
  useEffect(() => {
    if (!departureDate) {
      dispatch(setDepartureDate(todayString));
    }

    // If switching to one-way, clear return date
    if (isOneWay && returnDate) {
      dispatch(setReturnDate(null));
    }
  }, [departureDate, isOneWay, returnDate, dispatch, todayString]);

  // Generate marked dates for calendar
  const getMarkedDates = () => {
    const marked: MarkedDates = {};

    if (departureDate) {
      marked[departureDate] = {
        selected: true,
        selectedColor: COLORS.gray,
        selectedTextColor: "white",
      };
    }

    if (returnDate && !isOneWay) {
      marked[returnDate] = {
        selected: true,
        selectedColor: COLORS.gray,
        selectedTextColor: "white",
      };
    }

    return marked;
  };

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;

    if (isOneWay) {
      // For one-way trips, only set departure date
      dispatch(setDepartureDate(selectedDate));
      dispatch(setReturnDate(null));
    } else {
      // For round trips, handle both departure and return dates
      if (isSelectingDeparture) {
        dispatch(setDepartureDate(selectedDate));
        dispatch(setReturnDate(null));
        setIsSelectingDeparture(false);
      } else {
        if (new Date(selectedDate) < new Date(departureDate)) {
          dispatch(setDepartureDate(selectedDate));
          dispatch(setReturnDate(null));
          setIsSelectingDeparture(false);
        } else {
          dispatch(setReturnDate(selectedDate));
        }
      }
    }
  };

  const formatDateRange = () => {
    if (!departureDate) return "Select departure date";

    if (isOneWay) {
      return formatDate(departureDate);
    }

    if (!returnDate) {
      return `${formatDate(departureDate)} — Select return date`;
    }

    return `${formatDate(departureDate)} — ${formatDate(returnDate)}`;
  };

  const getSelectionLabel = () => {
    if (isOneWay) {
      return "SELECT DEPARTURE DATE";
    }

    return isSelectingDeparture
      ? "SELECT DEPARTURE DATE"
      : "SELECT RETURN DATE";
  };

  const handleSave = () => {
    // if (departureDate && (isOneWay || returnDate)) {
    //   onSave({
    //     departure: departureDate,
    //     return: isOneWay ? null : returnDate,
    //   });
    // }
  };

  const handleEdit = () => {
    if (!isOneWay) {
      setIsSelectingDeparture(true);
    }
    dispatch(setDepartureDate(todayString));
    dispatch(setReturnDate(null));
  };

  const canSave = departureDate && (isOneWay || returnDate);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.darkBackground}
      />

      <ScrollView>
        <View
          style={{
            backgroundColor: COLORS.darkBackground,
            flex: 1,
            padding: PADDING,
          }}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.selectedRangeContainer}>
            <Text style={styles.selectedRangeLabel}>{getSelectionLabel()}</Text>
            <View style={styles.selectedRangeRow}>
              <Text style={styles.selectedRangeText}>{formatDateRange()}</Text>
              {!isOneWay && (
                <TouchableOpacity
                  onPress={handleEdit}
                  style={styles.editButton}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            {isOneWay && (
              <Text style={styles.oneWayIndicator}>One-way trip</Text>
            )}
          </View>

          <Calendar
            current={departureDate || todayString}
            minDate={todayString}
            maxDate={
              new Date(
                today.getFullYear() + 1,
                today.getMonth(),
                today.getDate()
              )
                .toISOString()
                .split("T")[0]
            }
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            theme={{
              calendarBackground: COLORS.darkBackground,
              textSectionTitleColor: "#fff",
              textSectionTitleDisabledColor: "#fff",
              selectedDayBackgroundColor: "#0d1b2a",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#ffffff",
              dayTextColor: "#ffffff",
              textDisabledColor: "#666666",
              dotColor: "#0d1b2a",
              selectedDotColor: "#ffffff",
              arrowColor: "#ffffff",
              disabledArrowColor: "#666666",
              monthTextColor: "#ffffff",
              indicatorColor: "blue",
              textMonthFontSize: 18,
              textMonthFontWeight: "500",
              textDayFontSize: 16,
              textDayHeaderFontSize: 14,
              textDayHeaderFontWeight: "500",
            }}
            hideArrows={false}
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            enableSwipeMonths={true}
          />

          <View
            style={{
              marginVertical: RFValue(20),
              gap: 10,
            }}
          >
            <Text style={styles.selectedRangeLabel}>TRAVELERS</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 4 }}>
                <CustomText
                  variant="h7"
                  color="white"
                  style={{ fontWeight: "600" }}
                >
                  Adults
                </CustomText>
                <CustomText variant="h7" color="white">
                  18+ years
                </CustomText>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    dispatch(updateTravelerCount({ type: "decrement" }));
                  }}
                  style={{
                    height: 40,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: COLORS.gray,
                    borderRadius: 10,
                  }}
                >
                  <CustomText variant="h4" color="white">
                    -
                  </CustomText>
                </TouchableOpacity>
                <CustomText
                  variant="h5"
                  color="white"
                  style={{ fontVariant: ["tabular-nums"] }}
                >
                  {travelers}
                </CustomText>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    dispatch(updateTravelerCount({ type: "increment" }));
                  }}
                  style={{
                    height: 40,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: COLORS.gray,
                    borderRadius: 10,
                  }}
                >
                  <CustomText variant="h4" color="white">
                    +
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <Text style={styles.selectedRangeLabel}>CABIN CLASS</Text>

            <View style={{ gap: 12, flexDirection: "row", flexWrap: "wrap" }}>
              {CABIN_CLASS.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      padding: PADDING,
                      backgroundColor: COLORS.gray,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <CustomText variant="h7" color="white">
                      {item}
                    </CustomText>
                    {item === "Economy" && (
                      <View
                        style={{
                          backgroundColor: COLORS.darkBackground,
                          borderRadius: 100,
                          padding: 5,
                        }}
                      >
                        <AntDesign
                          name="close"
                          size={RFValue(10)}
                          color="white"
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
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
    marginBottom: 32,
    paddingTop: 24,
  },
  closeButton: {},
  saveButton: {
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  saveTextDisabled: {
    color: "#666666",
  },
  selectedRangeContainer: {
    marginBottom: 32,
  },
  selectedRangeLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
  },
  selectedRangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedRangeText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "400",
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  editText: {
    color: "#ffffff",
    fontSize: 14,
    opacity: 0.7,
  },
  oneWayIndicator: {
    color: "#ffffff",
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  calendar: {
    backgroundColor: COLORS.darkBackground,
    borderRadius: 10,
  },
});

export default DatePicker;

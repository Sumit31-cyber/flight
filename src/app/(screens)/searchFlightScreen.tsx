import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, HEADER_HEIGHT, PADDING } from "@/constants/constants";
import { searchFlight } from "@/utils/ApiManager";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FlightSearchResponse, Itinerary } from "@/utils/types";
import CustomText from "@/components/customText";
import { Image } from "expo-image";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import DashedLine from "@/components/DashedLine";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "@/utils/sharedFunctions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SearchFlightScreen = () => {
  const { returnDate, departureDate, travelers, departingFrom, flyingTo } =
    useSelector((state: RootState) => state.shared);
  const [flightResponse, setFlightResponse] = useState<FlightSearchResponse>();
  const [searching, setSearching] = useState(true);

  const { bottom } = useSafeAreaInsets();

  const getFlights = async () => {
    try {
      if (!departingFrom?.skyId || !departingFrom?.entityId) {
        setSearching(false);
        return;
      }

      if (!flyingTo?.skyId || !flyingTo?.entityId) {
        setSearching(false);
        return;
      }

      if (!departureDate) {
        setSearching(false);
        return;
      }

      if (!travelers || travelers <= 0) {
        setSearching(false);
        return;
      }

      const response = await searchFlight(
        departingFrom.skyId,
        flyingTo.skyId,
        departingFrom.entityId,
        flyingTo.entityId,
        departureDate,
        "economy",
        travelers
      );

      setFlightResponse(response);
      console.log(JSON.stringify(response, null, 2));
      setSearching(false);
    } catch (error) {
      console.log(error);
      setSearching(false);
    }
  };

  useEffect(() => {
    getFlights();
  }, []);

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

  const renderFlightItem = ({ item }: { item: Itinerary }) => {
    const leg = item.legs[0]; // Assuming single leg for now
    const carrier = leg.carriers.marketing[0];

    return (
      <TouchableOpacity style={styles.flightCard} activeOpacity={0.8}>
        {/* Header with airline info and price */}
        <View style={styles.flightHeader}>
          <View style={styles.airlineInfo}>
            <Image
              source={{ uri: carrier.logoUrl }}
              style={styles.airlineLogo}
              contentFit="contain"
            />
            <Text style={styles.airlineName}>{carrier.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.price.formatted}</Text>
            {item.tags && item.tags.includes("cheapest") && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Cheapest</Text>
              </View>
            )}
          </View>
        </View>

        {/* Flight details */}
        <View style={styles.flightDetails}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(leg.departure)}</Text>
            <Text style={styles.airport}>{leg.origin.displayCode}</Text>
            <Text style={styles.city}>{leg.origin.city}</Text>
          </View>

          <View style={styles.flightPath}>
            <Text style={styles.duration}>
              {formatDuration(leg.durationInMinutes)}
            </Text>
            <View style={styles.pathLine}>
              <View style={styles.dot} />
              <DashedLine style={{ borderColor: COLORS.gray }} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.stops}>{getStopInfo(leg.stopCount)}</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(leg.arrival)}</Text>
            <Text style={styles.airport}>{leg.destination.displayCode}</Text>
            <Text style={styles.city}>{leg.destination.city}</Text>
          </View>
        </View>

        {/* Additional info */}
        {leg.stopCount > 0 && leg.segments && (
          <View style={styles.segmentInfo}>
            <Text style={styles.segmentText}>
              Via {leg.segments[0].destination.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (searching && !flightResponse) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={"white"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.darkBackground }}>
      <View style={{ padding: PADDING, marginBottom: bottom }}>
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
            Search Results
          </CustomText>
        </View>

        <FlatList
          data={flightResponse?.data.itineraries}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                // alignItems: "center",
                // justifyContent: "space-between",
                marginVertical: PADDING,
                flex: 1,
              }}
            >
              {/* <View style={{ backgroundColor: "red", flex: 1, height: 50 }} />
              <View style={{ backgroundColor: "green", flex: 1, height: 50 }} />
              <View style={{ backgroundColor: "blue", flex: 1, height: 50 }} /> */}
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
                    backgroundColor={COLORS.darkBackground}
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
          }
          renderItem={renderFlightItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchFlightScreen;

// const departingFrom = {
//   entityId: "95673441",
//   navigation: {
//     entityId: "95673441",
//     entityType: "AIRPORT",
//     localizedName: "Patna",
//     relevantFlightParams: {
//       entityId: "95673441",
//       flightPlaceType: "AIRPORT",
//       localizedName: "Patna",
//       skyId: "PAT",
//     },
//     relevantHotelParams: {
//       entityId: "27545295",
//       entityType: "CITY",
//       localizedName: "Patna",
//     },
//   },
//   presentation: {
//     subtitle: "India",
//     suggestionTitle: "Patna (PAT)",
//     title: "Patna",
//   },
//   skyId: "PAT",
// };
// const flyingTo = {
//   entityId: "95673320",
//   navigation: {
//     entityId: "95673320",
//     entityType: "AIRPORT",
//     localizedName: "Mumbai",
//     relevantFlightParams: {
//       entityId: "95673320",
//       flightPlaceType: "AIRPORT",
//       localizedName: "Mumbai",
//       skyId: "BOM",
//     },
//     relevantHotelParams: {
//       entityId: "27539520",
//       entityType: "CITY",
//       localizedName: "Mumbai",
//     },
//   },
//   presentation: {
//     subtitle: "India",
//     suggestionTitle: "Mumbai (BOM)",
//     title: "Mumbai",
//   },
//   skyId: "BOM",
// };

// const flightResponse: FlightSearchResponse = {
//   status: true,
//   timestamp: 1753343452117,
//   data: {
//     context: {
//       status: "incomplete",
//       sessionId:
//         "KLUv_WAyACUHAMZQNCOgqQ2Pq77KVY3jX2CR3fNyHQNj2tySK7ehJ-3ZI6EiR1viAikAKwApAN9YF5tP3eTmb_kMlmaphUm6tQq2RqiernJW56t0Y3L21nxQAikchVmg7tu6mrIpTm9X5H2yn7Vj8SUCetDBWZiFFMF6SCCRSQNfOubr3PCVwXeVAbM7KjPDfvbJCTDMI6-UWmswaWPpNTpkVXNdXWqw4ZwPMqDlAJhWmmYeCcRSeC_fL9lmw6i9yqncyar6pXJzS60Xo9FwGJylceyavbPz-HTlezoDBQBcNtSzBCxNrk5Z4E2hAQ==",
//       totalResults: 10,
//     },
//     itineraries: [
//       {
//         id: "15194-2507311820--32671-1-10075-2507312340",
//         price: {
//           raw: 4989,
//           formatted: "₹4,989",
//           pricingOptionId: "FOuZz-lTqclZ",
//         },
//         legs: [
//           {
//             id: "15194-2507311820--32671-1-10075-2507312340",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 320,
//             stopCount: 1,
//             isSmallestStops: false,
//             departure: "2025-07-31T18:20:00",
//             arrival: "2025-07-31T23:40:00",
//             timeDeltaInDays: 0,
//             carriers: {
//               marketing: [
//                 {
//                   id: -32671,
//                   alternateId: "IX",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/IX.png",
//                   name: "Air India Express",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-10957-2507311820-2507312010--32671",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "DEL",
//                   displayCode: "DEL",
//                   parent: {
//                     flightPlaceId: "IDEL",
//                     displayCode: "DEL",
//                     name: "New Delhi",
//                     type: "City",
//                   },
//                   name: "Indira Gandhi International ",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T18:20:00",
//                 arrival: "2025-07-31T20:10:00",
//                 durationInMinutes: 110,
//                 flightNumber: "1010",
//                 marketingCarrier: {
//                   id: -32671,
//                   name: "Air India Express",
//                   alternateId: "IX",
//                   allianceId: 0,
//                   displayCode: "IX",
//                 },
//                 operatingCarrier: {
//                   id: -32671,
//                   name: "Air India Express",
//                   alternateId: "IX",
//                   allianceId: 0,
//                   displayCode: "IX",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//               {
//                 id: "10957-10075-2507312120-2507312340--32671",
//                 origin: {
//                   flightPlaceId: "DEL",
//                   displayCode: "DEL",
//                   parent: {
//                     flightPlaceId: "IDEL",
//                     displayCode: "DEL",
//                     name: "New Delhi",
//                     type: "City",
//                   },
//                   name: "Indira Gandhi International ",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T21:20:00",
//                 arrival: "2025-07-31T23:40:00",
//                 durationInMinutes: 140,
//                 flightNumber: "1163",
//                 marketingCarrier: {
//                   id: -32671,
//                   name: "Air India Express",
//                   alternateId: "IX",
//                   allianceId: 0,
//                   displayCode: "IX",
//                 },
//                 operatingCarrier: {
//                   id: -32671,
//                   name: "Air India Express",
//                   alternateId: "IX",
//                   allianceId: 0,
//                   displayCode: "IX",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         tags: ["cheapest"],
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.999,
//       },
//       {
//         id: "15194-2507311020--31826-0-10075-2507311305",
//         price: {
//           raw: 6168,
//           formatted: "₹6,168",
//           pricingOptionId: "yffDWYCF-pYS",
//         },
//         legs: [
//           {
//             id: "15194-2507311020--31826-0-10075-2507311305",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 165,
//             stopCount: 0,
//             isSmallestStops: false,
//             departure: "2025-07-31T10:20:00",
//             arrival: "2025-07-31T13:05:00",
//             timeDeltaInDays: 0,
//             carriers: {
//               marketing: [
//                 {
//                   id: -31826,
//                   alternateId: "0S",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/0S.png",
//                   name: "SpiceJet",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-10075-2507311020-2507311305--31826",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T10:20:00",
//                 arrival: "2025-07-31T13:05:00",
//                 durationInMinutes: 165,
//                 flightNumber: "211",
//                 marketingCarrier: {
//                   id: -31826,
//                   name: "SpiceJet",
//                   alternateId: "0S",
//                   allianceId: 0,
//                   displayCode: "SG",
//                 },
//                 operatingCarrier: {
//                   id: -31826,
//                   name: "SpiceJet",
//                   alternateId: "0S",
//                   allianceId: 0,
//                   displayCode: "SG",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         tags: ["second_cheapest", "third_shortest"],
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.84216,
//       },
//       {
//         id: "15194-2507312200--32213-0-10075-2508010040",
//         price: {
//           raw: 7196,
//           formatted: "₹7,196",
//           pricingOptionId: "A3uKwIzPnO0T",
//         },
//         legs: [
//           {
//             id: "15194-2507312200--32213-0-10075-2508010040",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 160,
//             stopCount: 0,
//             isSmallestStops: false,
//             departure: "2025-07-31T22:00:00",
//             arrival: "2025-08-01T00:40:00",
//             timeDeltaInDays: 1,
//             carriers: {
//               marketing: [
//                 {
//                   id: -32213,
//                   alternateId: "49",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/49.png",
//                   name: "IndiGo",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-10075-2507312200-2508010040--32213",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T22:00:00",
//                 arrival: "2025-08-01T00:40:00",
//                 durationInMinutes: 160,
//                 flightNumber: "6619",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         tags: ["third_cheapest", "shortest"],
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.534938,
//       },
//       {
//         id: "15194-2507311535--32213-0-10075-2507311815",
//         price: {
//           raw: 8745,
//           formatted: "₹8,745",
//           pricingOptionId: "fpVAIb7dttYu",
//         },
//         legs: [
//           {
//             id: "15194-2507311535--32213-0-10075-2507311815",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 160,
//             stopCount: 0,
//             isSmallestStops: false,
//             departure: "2025-07-31T15:35:00",
//             arrival: "2025-07-31T18:15:00",
//             timeDeltaInDays: 0,
//             carriers: {
//               marketing: [
//                 {
//                   id: -32213,
//                   alternateId: "49",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/49.png",
//                   name: "IndiGo",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-10075-2507311535-2507311815--32213",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T15:35:00",
//                 arrival: "2025-07-31T18:15:00",
//                 durationInMinutes: 160,
//                 flightNumber: "2167",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         tags: ["second_shortest"],
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.326161,
//       },
//       {
//         id: "15194-2507311355--32672-0-10075-2507311655",
//         price: {
//           raw: 8411,
//           formatted: "₹8,411",
//           pricingOptionId: "Afx5Ah7n3cHQ",
//         },
//         legs: [
//           {
//             id: "15194-2507311355--32672-0-10075-2507311655",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 180,
//             stopCount: 0,
//             isSmallestStops: false,
//             departure: "2025-07-31T13:55:00",
//             arrival: "2025-07-31T16:55:00",
//             timeDeltaInDays: 0,
//             carriers: {
//               marketing: [
//                 {
//                   id: -32672,
//                   alternateId: "AI",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/AI.png",
//                   name: "Air India",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-10075-2507311355-2507311655--32672",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T13:55:00",
//                 arrival: "2025-07-31T16:55:00",
//                 durationInMinutes: 180,
//                 flightNumber: "732",
//                 marketingCarrier: {
//                   id: -32672,
//                   name: "Air India",
//                   alternateId: "AI",
//                   allianceId: -31999,
//                   displayCode: "AI",
//                 },
//                 operatingCarrier: {
//                   id: -32672,
//                   name: "Air India",
//                   alternateId: "AI",
//                   allianceId: -31999,
//                   displayCode: "AI",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.322987,
//       },
//       {
//         id: "15194-2507311100--32213-1-10075-2507311605",
//         price: {
//           raw: 8048,
//           formatted: "₹8,048",
//           pricingOptionId: "d8xocHh2OWzi",
//         },
//         legs: [
//           {
//             id: "15194-2507311100--32213-1-10075-2507311605",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 305,
//             stopCount: 1,
//             isSmallestStops: false,
//             departure: "2025-07-31T11:00:00",
//             arrival: "2025-07-31T16:05:00",
//             timeDeltaInDays: 0,
//             carriers: {
//               marketing: [
//                 {
//                   id: -32213,
//                   alternateId: "49",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/49.png",
//                   name: "IndiGo",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-12371-2507311100-2507311310--32213",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "HYD",
//                   displayCode: "HYD",
//                   parent: {
//                     flightPlaceId: "IHYD",
//                     displayCode: "HYD",
//                     name: "Hyderabad",
//                     type: "City",
//                   },
//                   name: "Hyderabad",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T11:00:00",
//                 arrival: "2025-07-31T13:10:00",
//                 durationInMinutes: 130,
//                 flightNumber: "432",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//               {
//                 id: "12371-10075-2507311425-2507311605--32213",
//                 origin: {
//                   flightPlaceId: "HYD",
//                   displayCode: "HYD",
//                   parent: {
//                     flightPlaceId: "IHYD",
//                     displayCode: "HYD",
//                     name: "Hyderabad",
//                     type: "City",
//                   },
//                   name: "Hyderabad",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T14:25:00",
//                 arrival: "2025-07-31T16:05:00",
//                 durationInMinutes: 100,
//                 flightNumber: "5099",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.260373,
//       },
//       {
//         id: "15194-2507311830--32213-1-10075-2507312345",
//         price: {
//           raw: 8048,
//           formatted: "₹8,048",
//           pricingOptionId: "-AaadITXPbdj",
//         },
//         legs: [
//           {
//             id: "15194-2507311830--32213-1-10075-2507312345",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 315,
//             stopCount: 1,
//             isSmallestStops: false,
//             departure: "2025-07-31T18:30:00",
//             arrival: "2025-07-31T23:45:00",
//             timeDeltaInDays: 0,
//             carriers: {
//               marketing: [
//                 {
//                   id: -32213,
//                   alternateId: "49",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/49.png",
//                   name: "IndiGo",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-12371-2507311830-2507312035--32213",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "HYD",
//                   displayCode: "HYD",
//                   parent: {
//                     flightPlaceId: "IHYD",
//                     displayCode: "HYD",
//                     name: "Hyderabad",
//                     type: "City",
//                   },
//                   name: "Hyderabad",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T18:30:00",
//                 arrival: "2025-07-31T20:35:00",
//                 durationInMinutes: 125,
//                 flightNumber: "6127",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//               {
//                 id: "12371-10075-2507312205-2507312345--32213",
//                 origin: {
//                   flightPlaceId: "HYD",
//                   displayCode: "HYD",
//                   parent: {
//                     flightPlaceId: "IHYD",
//                     displayCode: "HYD",
//                     name: "Hyderabad",
//                     type: "City",
//                   },
//                   name: "Hyderabad",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T22:05:00",
//                 arrival: "2025-07-31T23:45:00",
//                 durationInMinutes: 100,
//                 flightNumber: "5203",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.251044,
//       },
//       {
//         id: "15194-2507311935--32213-1-10075-2508010115",
//         price: {
//           raw: 8048,
//           formatted: "₹8,048",
//           pricingOptionId: "-OI9aRsPznue",
//         },
//         legs: [
//           {
//             id: "15194-2507311935--32213-1-10075-2508010115",
//             origin: {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//               displayCode: "PAT",
//               city: "Patna",
//               country: "India",
//               isHighlighted: false,
//             },
//             destination: {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//               displayCode: "BOM",
//               city: "Mumbai",
//               country: "India",
//               isHighlighted: false,
//             },
//             durationInMinutes: 340,
//             stopCount: 1,
//             isSmallestStops: false,
//             departure: "2025-07-31T19:35:00",
//             arrival: "2025-08-01T01:15:00",
//             timeDeltaInDays: 1,
//             carriers: {
//               marketing: [
//                 {
//                   id: -32213,
//                   alternateId: "49",
//                   logoUrl:
//                     "https://logos.skyscnr.com/images/airlines/favicon/49.png",
//                   name: "IndiGo",
//                 },
//               ],
//               operationType: "fully_operated",
//             },
//             segments: [
//               {
//                 id: "15194-9436-2507311935-2507312150--32213",
//                 origin: {
//                   flightPlaceId: "PAT",
//                   displayCode: "PAT",
//                   parent: {
//                     flightPlaceId: "IPAT",
//                     displayCode: "PAT",
//                     name: "Patna",
//                     type: "City",
//                   },
//                   name: "Patna",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "AMD",
//                   displayCode: "AMD",
//                   parent: {
//                     flightPlaceId: "IAMD",
//                     displayCode: "AMD",
//                     name: "Ahmedabad",
//                     type: "City",
//                   },
//                   name: "Ahmedabad",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T19:35:00",
//                 arrival: "2025-07-31T21:50:00",
//                 durationInMinutes: 135,
//                 flightNumber: "178",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//               {
//                 id: "9436-10075-2507312345-2508010115--32213",
//                 origin: {
//                   flightPlaceId: "AMD",
//                   displayCode: "AMD",
//                   parent: {
//                     flightPlaceId: "IAMD",
//                     displayCode: "AMD",
//                     name: "Ahmedabad",
//                     type: "City",
//                   },
//                   name: "Ahmedabad",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 destination: {
//                   flightPlaceId: "BOM",
//                   displayCode: "BOM",
//                   parent: {
//                     flightPlaceId: "IBOM",
//                     displayCode: "BOM",
//                     name: "Mumbai",
//                     type: "City",
//                   },
//                   name: "Mumbai",
//                   type: "Airport",
//                   country: "India",
//                 },
//                 departure: "2025-07-31T23:45:00",
//                 arrival: "2025-08-01T01:15:00",
//                 durationInMinutes: 90,
//                 flightNumber: "6351",
//                 marketingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 operatingCarrier: {
//                   id: -32213,
//                   name: "IndiGo",
//                   alternateId: "49",
//                   allianceId: 0,
//                   displayCode: "6E",
//                 },
//                 transportMode: "TRANSPORT_MODE_FLIGHT",
//               },
//             ],
//           },
//         ],
//         isSelfTransfer: false,
//         isProtectedSelfTransfer: false,
//         farePolicy: {
//           isChangeAllowed: false,
//           isPartiallyChangeable: false,
//           isCancellationAllowed: false,
//           isPartiallyRefundable: false,
//         },
//         fareAttributes: {},
//         isMashUp: false,
//         hasFlexibleOptions: false,
//         score: 0.246196,
//       },
//     ],
//     messages: [],
//     filterStats: {
//       duration: {
//         min: 160,
//         max: 505,
//         multiCityMin: 160,
//         multiCityMax: 505,
//       },
//       total: 10,
//       hasCityOpenJaw: false,
//       multipleCarriers: {
//         minPrice: "",
//         rawMinPrice: null,
//       },
//       airports: [
//         {
//           city: "Mumbai",
//           airports: [
//             {
//               id: "BOM",
//               entityId: "95673320",
//               name: "Mumbai",
//             },
//           ],
//         },
//         {
//           city: "Patna",
//           airports: [
//             {
//               id: "PAT",
//               entityId: "95673441",
//               name: "Patna",
//             },
//           ],
//         },
//       ],
//       carriers: [
//         {
//           id: -32672,
//           alternateId: "AI",
//           logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/AI.png",
//           name: "Air India",
//           minPrice: "₹8,411",
//           allianceId: -31999,
//         },
//         {
//           id: -32671,
//           alternateId: "IX",
//           logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/IX.png",
//           name: "Air India Express",
//           minPrice: "₹4,989",
//           allianceId: 0,
//         },
//         {
//           id: -32213,
//           alternateId: "49",
//           logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/49.png",
//           name: "IndiGo",
//           minPrice: "₹7,196",
//           allianceId: 0,
//         },
//         {
//           id: -31826,
//           alternateId: "0S",
//           logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/0S.png",
//           name: "SpiceJet",
//           minPrice: "₹6,168",
//           allianceId: 0,
//         },
//       ],
//       stopPrices: {
//         direct: {
//           isPresent: true,
//           formattedPrice: "₹6,168",
//           rawPrice: 6168,
//         },
//         one: {
//           isPresent: true,
//           formattedPrice: "₹4,989",
//           rawPrice: 4989,
//         },
//         twoOrMore: {
//           isPresent: false,
//         },
//       },
//       alliances: [
//         {
//           id: -31999,
//           name: "Star Alliance",
//         },
//       ],
//     },
//     flightsSessionId: "f3b591d0-2098-4920-b2cd-7c2038e1c023",
//     destinationImageUrl:
//       "https://content.skyscnr.com/m/3719e8f4a5daf43d/original/Flights-Placeholder.jpg",
//   },
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listContainer: {
    padding: 16,
  },
  flightCard: {
    backgroundColor: "#fff",
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
  airlineName: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
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
    fontSize: 10,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  airport: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  city: {
    fontSize: 10,
    color: "#999",
    marginTop: 1,
  },
  flightPath: {
    alignItems: "center",
    flex: 2,
    paddingHorizontal: 16,
  },
  duration: {
    fontSize: 12,
    color: "#666",
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
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  segmentInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  segmentText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

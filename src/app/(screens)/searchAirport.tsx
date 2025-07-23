import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  BORDER_WIDTH,
  COLORS,
  HEADER_HEIGHT,
  PADDING,
} from "@/constants/constants";
import { router, useLocalSearchParams } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { ArrowLeft } from "lucide-react-native";
import CustomText from "@/components/customText";
import { debounce } from "@/utils/sharedFunctions";
import { AirportData, SearchAirportResponse } from "@/utils/types";
import { searchAirports } from "@/utils/ApiManager";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setDepartingFrom, setFlyingTo } from "@/redux/slice/sharedSlice";

const SearchAirport = () => {
  const { value } = useLocalSearchParams<{ value: string }>();
  const [query, setQuery] = useState("");
  const [searchResponse, setSearchResponse] =
    useState<SearchAirportResponse | null>();
  const [searching, setSearching] = useState(false);
  const dispatch = useDispatch();

  const searchHandler = async (value: string) => {
    try {
      if (!value) {
        setSearching(false);
        setSearchResponse(null);
        return;
      }
      setSearching(true);
      const response = await searchAirports(value);
      console.log(JSON.stringify(response, null, 2));
      setSearchResponse(response);
      setSearching(false);
    } catch (error) {
      console.log(error);
      setSearching(false);
    }
  };

  const searchWithDebounce = useCallback(debounce(searchHandler, 300), []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.darkBackground,
        padding: PADDING,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
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
            Where {value}
          </CustomText>
        </View>
        <View
          style={{
            width: "100%",
            borderWidth: BORDER_WIDTH,
            borderColor: "white",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: PADDING * 1.3,
          }}
        >
          <CustomText variant="h7" color="white">
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : ""}
          </CustomText>
          <TextInput
            placeholder={`Country, city or airport`}
            onChangeText={(value) => {
              setSearching(true);
              setQuery(value);
            }}
            value={query}
            onChange={(value) => searchWithDebounce(value.nativeEvent.text)}
            placeholderTextColor={"#ffffff60"}
            style={{
              fontSize: RFValue(10),
              flex: 1,
              padding: PADDING * 1.3,
              color: "white",
            }}
          />
        </View>

        <FlatList
          data={searchResponse?.data}
          contentContainerStyle={{ gap: RFValue(15) }}
          ListHeaderComponent={
            <>
              {searching && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: RFValue(15),
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
            </>
          }
          renderItem={({ item, index }) => {
            return (
              <AirportCard
                item={item}
                index={index}
                onPress={() => {
                  if (value === "from") {
                    dispatch(setDepartingFrom(item));
                  } else {
                    dispatch(setFlyingTo(item));
                  }
                }}
              />
            );
          }}
        />
        {/* <View style={{ flex: 1, gap: 20, marginTop: RFValue(20) }}>
          {searchResponse?.data.map((item, index) => {
            return ;
          })}
        </View> */}
      </SafeAreaView>
    </View>
  );
};

export default SearchAirport;

const styles = StyleSheet.create({});

const AirportCard = ({
  item,
  index,
  onPress,
}: {
  item: AirportData;
  index: number;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
    >
      <View style={{ transform: [{ rotate: "30deg" }] }}>
        <MaterialIcons name="flight" size={RFValue(24)} color={"white"} />
      </View>
      <View style={{ gap: 4 }}>
        <CustomText variant="h7" color="white">
          {item.presentation.suggestionTitle}
        </CustomText>
        <CustomText variant="h8" color="white">
          Airport • {item.presentation.subtitle}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

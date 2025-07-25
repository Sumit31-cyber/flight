import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS, PADDING } from "@/constants/constants";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "@/components/customText";
import { useAuth } from "@clerk/clerk-expo";

const Profile = () => {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (err) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.darkBackground }}>
      <View style={{ paddingHorizontal: PADDING, flex: 1 }}>
        <Header title="Profile" />
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={handleSignout}
            style={{
              padding: PADDING,
              backgroundColor: "#e6394610",
              borderRadius: 10,
              marginTop: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomText variant="h5" color="#e63946">
              Sign Out
            </CustomText>

            {isLoading && <ActivityIndicator color={"#e63946"} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});

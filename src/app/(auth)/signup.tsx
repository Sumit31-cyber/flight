import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  COLORS,
  PADDING,
  screenHeight,
  screenWidth,
} from "../../../constants/constants";
import CustomText from "../../../components/customText";
import CustomInout from "../../../components/CustomTextinput";
import { Image, ImageBackground } from "expo-image";
import { Eye, Lock, Mail, Smartphone } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useGradualAnimation from "@/utils/customHooks/useGradualAnimation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setIsSigningUp(true);
    try {
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
      setIsSigningUp(false);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setIsSigningUp(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.darkBackground }}>
      {/* HEADER */}
      <KeyboardAwareScrollView
        bounces={false}
        extraHeight={RFValue(100)}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        <View
          style={{
            height: screenHeight * 0.4,
            width: screenWidth,
            backgroundColor: COLORS.liteGray,
          }}
        >
          <ImageBackground
            source={require("../../../assets/images/worldMapPng.png")}
            style={{ flex: 1, padding: PADDING }}
          >
            <View style={{ marginTop: "auto", gap: 5 }}>
              <CustomText
                variant="h6"
                style={{ fontWeight: "300", color: "white" }}
              >
                Hello
              </CustomText>
              <CustomText
                variant="h2"
                style={{ fontWeight: "700", color: "white" }}
              >
                Sign Up Now
              </CustomText>
            </View>
          </ImageBackground>
        </View>
        <View style={{ padding: PADDING }}>
          <CustomInout
            type="email"
            label="Email"
            icon={<Mail size={RFValue(18)} color={"white"} />}
            onChangeText={(value) => setEmailAddress(value)}
            // error={"Email is incorrect"}
          />
          <CustomInout
            type="phone"
            label="Phone"
            icon={<Smartphone size={RFValue(18)} color={"white"} />}
            // error={"Email is incorrect"}
          />
          <CustomInout
            type="password"
            label="Password"
            icon={<Lock size={RFValue(18)} color={"white"} />}
            onChangeText={(value) => setPassword(value)}
            // error={"Password is incorrect"}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSignUpPress}
          style={{
            height: RFValue(40),
            backgroundColor: "#5c73b6",
            marginHorizontal: PADDING,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {isSigningUp ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <CustomText variant="h6" color="white">
              Sign Up
            </CustomText>
          )}
        </TouchableOpacity>
        <View
          style={{
            marginBottom: RFValue(20),
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <CustomText variant="h7" color="white">
            Already have an account?
          </CustomText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.back();
            }}
          >
            <CustomText variant="h7" color="#5c73b6">
              Sign In
            </CustomText>
          </TouchableOpacity>
        </View>
        {/* <Animated.View style={[fakeView, { marginTop: "auto" }]} /> */}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({});

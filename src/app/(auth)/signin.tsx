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
import { ImageBackground } from "expo-image";
import { Lock, Mail } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useGradualAnimation from "@/utils/customHooks/useGradualAnimation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

const Signin = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const onSignInPress = async () => {
    if (!isLoaded || !signIn) return;

    setIsSigningIn(true);
    setEmailError("");
    setPasswordError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      console.log(JSON.stringify(signInAttempt, null, 2));

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));

      const param = err?.errors?.[0]?.meta?.paramName;

      if (param === "identifier") {
        setEmailError("Incorrect email address");
      } else if (param === "password") {
        setPasswordError("Incorrect password, Please enter correct password");
      } else {
        console.log("Unhandled error", err);
      }
    } finally {
      setIsSigningIn(false);
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
            height: screenHeight * 0.5,
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
                WELCOME
              </CustomText>
              <CustomText
                variant="h2"
                style={{ fontWeight: "700", color: "white" }}
              >
                Log in Again
              </CustomText>
            </View>
          </ImageBackground>
        </View>
        <View style={{ padding: PADDING }}>
          <CustomInout
            value={emailAddress}
            type="email"
            label="Email"
            icon={<Mail size={RFValue(18)} color={"white"} />}
            onChangeText={setEmailAddress}
            onChange={() => {
              setEmailError("");
            }}
            error={emailError}
          />
          <CustomInout
            value={password}
            type="password"
            label="Password"
            icon={<Lock size={RFValue(18)} color={"white"} />}
            onChangeText={setPassword}
            onChange={() => {
              setPasswordError("");
            }}
            error={passwordError}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSignInPress}
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
          {isSigningIn ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <CustomText variant="h6" color="white">
              Login
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
            Don't you have an account?
          </CustomText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.navigate("/(auth)/signup");
            }}
          >
            <CustomText variant="h7" color="#5c73b6">
              Sign Up now
            </CustomText>
          </TouchableOpacity>
        </View>
        {/* <Animated.View style={[fakeView, { marginTop: "auto" }]} /> */}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({});

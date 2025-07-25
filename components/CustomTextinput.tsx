import { BORDER_WIDTH, COLORS } from "@/constants/constants";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./customText";
import { Eye, EyeClosed } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export type InputType = "email" | "phone" | "password" | "text" | "number";

interface InputFieldProps extends Omit<TextInputProps, "style"> {
  type: InputType;
  label?: string;
  icon: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  error?: string;
  darkMode?: boolean;
  showPasswordToggle?: boolean;
}

const CustomInput: React.FC<InputFieldProps> = ({
  type,
  label,
  icon,
  containerStyle,
  labelStyle,
  inputStyle,
  error,
  value,
  onChangeText,
  placeholder,
  showPasswordToggle = true,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Get input configuration based on type
  const getInputConfig = () => {
    switch (type) {
      case "email":
        return {
          keyboardType: "email-address" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
          secureTextEntry: false,
          placeholder: placeholder || "example@email.com",
          label: label || "Email",
        };
      case "phone":
        return {
          keyboardType: "phone-pad" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
          secureTextEntry: false,
          placeholder: placeholder || "+1 (555) 123-4567",
          label: label || "Phone Number",
        };
      case "password":
        return {
          keyboardType: "default" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
          secureTextEntry: showPasswordToggle ? !isPasswordVisible : true,
          placeholder: placeholder || "••••••••",
          label: label || "Password",
        };
      case "number":
        return {
          keyboardType: "numeric" as const,
          autoCapitalize: "none" as const,
          autoCorrect: false,
          secureTextEntry: false,
          placeholder: placeholder || "123456",
          label: label || "Number",
        };
      default:
        return {
          keyboardType: "default" as const,
          autoCapitalize: "sentences" as const,
          autoCorrect: true,
          secureTextEntry: false,
          placeholder: placeholder || "Enter text",
          label: label || "Text",
        };
    }
  };

  const config = getInputConfig();

  // Render password toggle button
  const renderPasswordToggle = () => {
    if (type !== "password" || !showPasswordToggle) return null;

    return (
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={styles.passwordToggle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.eyeIcon}>
          {isPasswordVisible ? (
            <Eye color={"white"} size={RFValue(18)} />
          ) : (
            <EyeClosed color={"white"} size={RFValue(18)} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <CustomText variant="h6" style={[styles.label]}>
        {config.label}
      </CustomText>

      <View
        style={[
          styles.inputContainer,
          { borderWidth: isFocused ? BORDER_WIDTH : 0 },
        ]}
      >
        <View
          style={{
            width: RFValue(20),
            aspectRatio: 1,
            alignItems: "center",
            justifyContent: "center",
            opacity: isFocused ? 1 : 0.7,
          }}
        >
          {icon}
        </View>

        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={config.placeholder}
          keyboardType={config.keyboardType}
          autoCapitalize={config.autoCapitalize}
          autoCorrect={config.autoCorrect}
          secureTextEntry={config.secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />

        {renderPasswordToggle()}
      </View>

      {error && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            gap: 6,
          }}
        >
          <View
            style={{
              height: RFValue(14),
              aspectRatio: 1,
              borderRadius: 100,
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomText variant="h8" color="white">
              !
            </CustomText>
          </View>
          <CustomText variant={"h7"} style={[styles.errorText]}>
            {error}
          </CustomText>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 8,
    color: "white",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "white",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    gap: 10,
    backgroundColor: COLORS.liteGray,
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },
  errorText: {
    color: "red",
  },
  passwordToggle: {
    marginLeft: 8,
    padding: 4,
  },

  // Email icon
  emailIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  envelope: {
    width: 20,
    height: 14,
    borderRadius: 2,
  },

  // Phone icon
  phoneIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneBody: {
    width: 14,
    height: 20,
    borderRadius: 3,
  },

  // Lock icon
  lockIcon: {
    width: 24,
    height: 24,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  lockBody: {
    width: 14,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 2,
    borderTopWidth: 0,
  },
  lockShackle: {
    width: 8,
    height: 6,
    borderWidth: 1.5,
    borderRadius: 4,
    borderBottomWidth: 0,
    position: "absolute",
    top: 4,
  },

  // Number icon
  numberIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // Text icon
  textIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 3,
  },
  textLine: {
    height: 2,
    width: 16,
    borderRadius: 1,
  },

  // Eye icon for password toggle
  eyeIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeShape: {
    width: 16,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 8,
  },
  eyeSlash: {
    position: "absolute",
    width: 18,
    height: 1.5,
    borderRadius: 1,
    transform: [{ rotate: "45deg" }],
  },
});

export default CustomInput;

// Usage examples:
/*
import InputField from './InputField';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#0f0f0f' }}>
      <InputField
        type="email"
        value={email}
        onChangeText={setEmail}
        darkMode={true}
      />
      
      <InputField
        type="phone"
        value={phone}
        onChangeText={setPhone}
        darkMode={true}
      />
      
      <InputField
        type="password"
        value={password}
        onChangeText={setPassword}
        darkMode={true}
        showPasswordToggle={true}
      />
      
      <InputField
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        darkMode={true}
      />
    </View>
  );
};
*/

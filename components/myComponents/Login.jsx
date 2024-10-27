import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Login() {
  const route = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={() => route.push("/auth/signIn")}>
        <Text>Login </Text>
      </TouchableOpacity>
    </View>
  );
}

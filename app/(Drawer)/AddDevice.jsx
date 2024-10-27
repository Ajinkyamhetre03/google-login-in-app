import { View, Text } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";

export default function AddDevice() {
  return (
    <WebView style={styles.container} source={{ uri: "http://google.com" }} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

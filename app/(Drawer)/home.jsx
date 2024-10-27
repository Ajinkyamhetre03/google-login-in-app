import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const Btn = () => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        console.log("its working onpress");
      }}
      onLongPress={() => {
        console.log("its working onlongpress");
      }}
    >
      <Text style={styles.buttonText}>Create Account </Text>
    </TouchableOpacity>
  );
};

const btnNumber = 10;

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      {Array.from({ length: btnNumber }, (_, index) => (
        <Btn key={index} />
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows buttons to wrap to the next row
    justifyContent: "space-around", // Distribute space around buttons
  },
  button: {
    borderWidth: 1,
    height: 100,
    width: "22%", // Set width to allow 4 buttons per row
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
});

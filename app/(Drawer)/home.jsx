import { ScrollView } from "react-native";
import React from "react";
import Device from "../../components/myComponents/device";
import { Colors } from "../../constants/Colors";

export default function Home() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundColor }}>
      <Device />
      <Device />
    </ScrollView>
  );
}

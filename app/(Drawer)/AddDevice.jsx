import {
  View,
  Text,
  Button,
  ToastAndroid,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { Colors } from "./../../constants/Colors";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "./../../configFireBase/configFirebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function AddDevice() {
  const [wifiName, setWifiName] = useState(""); // State for Wi-Fi name
  const [password, setPassword] = useState(""); // State for password
  const [numOfDevice, setNumOfDevice] = useState(null); // State for number of devices
  const [buttonType, setButtonType] = useState(null); // State for button type
  const [isConnected, setIsConnected] = useState(false); // State for Wi-Fi connection status
  const route = useRouter();

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.type === "wifi") {
        setIsConnected(true); // Set as connected if Wi-Fi is available
      } else {
        setIsConnected(false); // Set as disconnected otherwise
      }
    });

    return () => {
      unsubscribe(); // Cleanup subscription on unmount
    };
  }, []);

  const sendData = async () => {
    if (!wifiName || !password || !numOfDevice || !buttonType) {
      ToastAndroid.show("Please fill all fields!", ToastAndroid.SHORT);
      return;
    }

    // JSON data format as specified
    const jsonData = {
      wifiname: wifiName,
      password: password,
      numOfDevice: numOfDevice,
      topic: "user.email",
      buttontype: buttonType,
    };
    route.replace("/dataToDb");

    try {
      await AsyncStorage.setItem("wifiConfig", JSON.stringify(jsonData));
      const response = await fetch("http://192.168.4.1/saveWiFi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        ToastAndroid.show("Data sent successfully!", ToastAndroid.SHORT);
        route.replace("/dataToDb");
      } else {
        const errorText = await response.text();
        ToastAndroid.show("Failed to send data!", ToastAndroid.SHORT);
        console.error("Error:", errorText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      ToastAndroid.show("Error occurred!", ToastAndroid.SHORT);
    }
  };

  if (!isConnected) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.backgroundColor,
        }}
      >
        <Text style={{ fontSize: 20, textAlign: "center", marginTop: "-20%" }}>
          Please connect to the ESP Wi-Fi network and disable mobile data!
        </Text>
        <ActivityIndicator
          size={100}
          style={{ marginTop: "10%" }}
          color={Colors.btnbackgroundColor}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Wi-Fi Name </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Wi-Fi Name"
        value={wifiName}
        onChangeText={setWifiName}
      />

      <Text style={styles.title}>Enter Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.title}>Select Number of Devices </Text>
      <RNPickerSelect
        onValueChange={(value) => setNumOfDevice(value)}
        items={[
          { label: "1 Device", value: 1 },
          { label: "2 Devices", value: 2 },
          { label: "3 Devices", value: 3 },
          { label: "4 Devices", value: 4 },
          { label: "5 Devices", value: 5 },
        ]}
        placeholder={{ label: "Select Number of Devices", value: null }}
        style={{
          inputIOS: {
            ...styles.input,
            paddingLeft: 10,
          },
          inputAndroid: {
            ...styles.input,
            paddingLeft: 10,
          },
          placeholder: styles.placeholder, // Apply the placeholder styles here
        }}
      />

      <Text style={styles.title}>Select Button Type </Text>
      <RNPickerSelect
        onValueChange={(value) => setButtonType(value)}
        items={[
          { label: "Touch", value: "touch" },
          { label: "Switch", value: "switch" },
        ]}
        placeholder={{ label: "Select Button Type", value: null }}
        style={{
          inputIOS: {
            ...styles.input,
            paddingLeft: 10,
          },
          inputAndroid: {
            ...styles.input,
            paddingLeft: 10,
          },
          placeholder: styles.placeholder, // Apply the placeholder styles here
        }}
      />

      <TouchableOpacity style={styles.btn} onPress={sendData}>
        <Text style={styles.btnText}>Config New Device </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.backgroundColor,
    marginTop: -50,
  },
  input: {
    height: 40,
    borderColor: Colors.btnbackgroundColor,
    borderWidth: 1,
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    marginTop: "5%",
  },
  btn: {
    backgroundColor: Colors.btnbackgroundColor,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  placeholder: {
    color: "gray", // Set the placeholder label color here
    fontSize: 30, // Set the font size for the placeholder
    fontWeight: "bold", // Set the font weight for the placeholder
  },
});

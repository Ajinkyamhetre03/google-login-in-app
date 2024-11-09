import {
  View,
  Text,
  ToastAndroid,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { Colors } from "./../../constants/Colors";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddDevice() {
  const [wifiName, setWifiName] = useState(""); // Wi-Fi name state
  const [password, setPassword] = useState(""); // Password state
  const [deviceName, setDeviceName] = useState(""); // Password state
  const [numOfDevice, setNumOfDevice] = useState(null); // Number of devices
  const [buttonType, setButtonType] = useState(null); // Button type (touch or switch)
  const [macAddress, setMacAddress] = useState(""); // MAC address state
  const [isConnected, setIsConnected] = useState(false); // Wi-Fi connection state
  const [refreshing, setRefreshing] = useState(false); // Refresh state
  const route = useRouter();

  useEffect(() => {
    // Listen to Wi-Fi connection state
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.type === "wifi") {
        fetchMacAddress();
        setIsConnected(true); // Connected to Wi-Fi
      } else {
        setIsConnected(false); // Not connected
      }
    });

    return () => {
      unsubscribe(); // Cleanup on unmount
    };
  }, []);

  // Function to fetch MAC address from ESP
  const fetchMacAddress = async () => {
    let isMacAddressFetched = false;

    while (!isMacAddressFetched) {
      try {
        const response = await fetch("http://192.168.4.1/macAddress"); // ESP MAC address endpoint
        const data = await response.json();
        if (data.macAddress) {
          setMacAddress(data.macAddress);
          console.log("MAC Address:", data.macAddress);
          isMacAddressFetched = true; // Successfully fetched MAC address
        } else {
          ToastAndroid.show(
            "Failed to get MAC address, retrying...",
            ToastAndroid.SHORT
          );
        }
      } catch (error) {
        console.error("Error fetching MAC address:", error);
        ToastAndroid.show(
          "Error fetching MAC address, retrying...",
          ToastAndroid.SHORT
        );
      }
      // Delay before trying again if MAC address is not fetched
      if (!isMacAddressFetched) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Retry after 2 seconds
      }
    }
  };

  // Send Wi-Fi configuration data to ESP
  const sendData = async () => {
    if (
      !wifiName ||
      !password ||
      !numOfDevice ||
      !buttonType ||
      !deviceName ||
      !macAddress
    ) {
      ToastAndroid.show("Please fill all fields!", ToastAndroid.SHORT);
      if (!macAddress) {
        ToastAndroid.show("Please to the esp Wifi", ToastAndroid.SHORT);
      }
      return;
    }

    const jsonData = {
      wifiname: wifiName,
      password: password,
      numOfDevice: numOfDevice,
      buttontype: buttonType,
      deviceName: deviceName,
      topic: macAddress,
    };

    try {
      await AsyncStorage.setItem("wifiConfig", JSON.stringify(jsonData));

      // First fetch the MAC address before proceeding
      await fetchMacAddress(); // Wait for MAC address to be fetched

      // Proceed to next route after MAC address is fetched
      route.replace("/dataToDb");

      const response = await fetch("http://192.168.4.1/saveWiFi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        ToastAndroid.show("Data sent successfully!", ToastAndroid.SHORT);
        const result = await response.json();
        if (result.status === "success") {
          console.log("Data received successfully: ", result);
        }
      } else {
        ToastAndroid.show("Failed to send data!", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      ToastAndroid.show("Error occurred!", ToastAndroid.SHORT);
    }
  };

  // Handle the refresh action
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching the latest data
    setTimeout(() => {
      fetchMacAddress(); // Refetch MAC address on refresh
      setRefreshing(false);
    }, 2000);
  };

  if (!isConnected) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>
          Please connect to the ESP Wi-Fi network and disable mobile data!
        </Text>
        <ActivityIndicator
          size={100}
          style={styles.loader}
          color={Colors.btnbackgroundColor}
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Enter Wi-Fi Name</Text>
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

        <Text style={styles.title}>Device Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Wi-Fi Name"
          value={deviceName}
          onChangeText={setDeviceName}
        />

        <Text style={styles.title}>Select Number of Devices</Text>
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
            inputIOS: styles.input,
            inputAndroid: styles.input,
          }}
        />

        <Text style={styles.title}>Select Button Type</Text>
        <RNPickerSelect
          onValueChange={(value) => setButtonType(value)}
          items={[
            { label: "Touch Button", value: "touch" },
            { label: "Switch Button", value: "switch" },
          ]}
          placeholder={{ label: "Select Button Type", value: null }}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
          }}
        />

        <TouchableOpacity onPress={sendData} style={styles.button}>
          <Text style={styles.buttonText}>Send Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch", // Stretch to fill the width
    paddingHorizontal: 10, // Added horizontal padding to remove extra space
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: Colors.textColor,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    alignItems: "center",
    alignSelf: "center",
    borderColor: Colors.btnbackgroundColor,
    padding: 8,
    width: "80%", // Ensure full width for inputs
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.btnbackgroundColor,
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    width: "40%", // Button width to fill full screen width
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  macAddress: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.textColor,
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.btnbackgroundColor,
    textAlign: "center",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "stretch", // Make content stretch across the screen width
  },
});

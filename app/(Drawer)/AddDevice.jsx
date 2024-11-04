import {
  View,
  Text,
  Button,
  ToastAndroid,
  TextInput,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function AddDevice() {
  const [url, setUrl] = useState(""); // State for storing the user-entered URL
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
    const trimmedUrl = url.trim();
    console.log("URL entered:", trimmedUrl); // Log the current URL

    if (!trimmedUrl) {
      ToastAndroid.show("Please enter a valid URL!", ToastAndroid.SHORT);
      console.log("No valid URL entered, stopping the request.");
      return;
    }

    try {
      console.log("Attempting to send data to:", trimmedUrl); // Log before fetch call
      const response = await fetch(trimmedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid: "Redmi",
          password: "00000000",
        }),
      });

      console.log("Fetch request completed. Response status:", response.status); // Log response status
      route.replace("/(Drawer)");
      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const jsonResponse = await response.json();
          console.log("Response received:", jsonResponse); // Log JSON response
          ToastAndroid.show("Data sent successfully!", ToastAndroid.SHORT);
        } else {
          // Handle non-JSON response
          const textResponse = await response.text();
          console.log("Non-JSON response received:", textResponse);
          ToastAndroid.show(
            "Data sent successfully, but response was not JSON.",
            ToastAndroid.SHORT
          );
        }
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to send data. Status:",
          response.status,
          "Error:",
          errorText
        ); // Log error details
        ToastAndroid.show("Failed to send data!", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error occurred during fetch:", error); // Log fetch error
      ToastAndroid.show("Error occurred!", ToastAndroid.SHORT);
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={{ marginBottom: 10 }}>
          Please connect to the ESP Wi-Fi network and disable mobile Data a!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Enter URL to send Wi-Fi data</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter URL"
        value={url}
        onChangeText={(text) => {
          setUrl(text);
          console.log("URL updated:", text); // Log URL every time it changes
        }}
      />
      <Button title="Send Data" onPress={sendData} />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
};

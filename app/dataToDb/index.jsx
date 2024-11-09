import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc } from "firebase/firestore";
import { Colors } from "./../../constants/Colors";
import { auth, db } from "./../../configFireBase/configFirebase";
import { useNavigation, useRouter } from "expo-router";

const user = auth.currentUser;
export default function Model() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInternetAvailable, setIsInternetAvailable] = useState(false);
  const navigation = useNavigation();
  const route = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Device Configuration",
      headerStyle: {
        backgroundColor: Colors.backgroundColor,
      },
      headerTintColor: "black",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const checkInternetConnection = async () => {
      try {
        const response = await axios.get("https://www.google.com", {
          timeout: 5000,
        });
        setIsInternetAvailable(response.status === 200);
      } catch (error) {
        setIsInternetAvailable(false);
      }
    };

    if (isConnected) {
      checkInternetConnection();
    } else {
      setIsInternetAvailable(false);
    }

    return () => unsubscribe();
  }, [isConnected]);

  const getStoredData = async () => {
    console.log(user.email ? user.email : "null ");

    try {
      const storedData = await AsyncStorage.getItem("wifiConfig");
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        console.log(parsedData);

        try {
          await addDoc(collection(db, user.email), { ...parsedData });
          console.log("Data successfully added to Firestore");
          route.replace("/(Drawer)/home");
        } catch (e) {
          console.error("Error adding data: ", e);
        }
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  if (isConnected) {
    if (isInternetAvailable) {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={getStoredData}>
            <Text style={styles.buttonText}>Config Device Data</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.messageText}>No internet found</Text>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Please turn on the data</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
    padding: 20,
  },
  button: {
    backgroundColor: Colors.btnbackgroundColor,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
});

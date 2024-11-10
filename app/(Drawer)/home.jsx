import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db, auth } from "./../../configFireBase/configFirebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Colors } from "../../constants/Colors";
import { Client, Message } from "paho-mqtt";

const client = new Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        navigation.replace("Login");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    // Define the success callback
    const onSuccess = () => {
      console.log("Connected to MQTT broker");
      client.subscribe("test/topic"); // Change to your topic

      // Define message handler
      client.onMessageArrived = (message) => {
        console.log("Received message:", message.payloadString);
      };
    };

    // Define the failure callback
    const onFailure = (error) => {
      console.error("Connection failed:", error);
    };

    // Connect the client with callbacks
    client.connect({
      onSuccess,
      onFailure,
    });

    // Clean up the client on unmount
    return () => {
      if (client.isConnected()) client.disconnect();
    };
  }, []);

  const sendMessage = (topic, index) => {
    if (client.isConnected()) {
      const input = `${topic} is ON and no is ${index + 1}`; // Fixed string format
      const message = new Message(input);
      message.destinationName = "test/topic"; // Replace with your topic
      client.send(message);
      console.log("Message sent:", input);
    } else {
      console.log("Failed to send message. Ensure client is connected.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, user.email));
      const deviceData = [];
      querySnapshot.forEach((doc) => {
        const data = {
          numOfDevice: doc.data().numOfDevice,
          topic: doc.data().topic,
          buttontype: doc.data().buttontype,
          password: doc.data().password,
          wifiname: doc.data().wifiname,
          deviceName: doc.data().deviceName,
        };

        deviceData.push(data);
      });
      setDevices(deviceData);
    } catch (error) {
      console.error("Error fetching devices: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color={"black"} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: Colors.backgroundColor }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {devices && devices.length > 0 ? (
        devices.map((device, index) => (
          <View key={index} style={styles.centerContainer}>
            <View style={styles.deviceContainer}>
              <View style={styles.iconRow}>
                <View style={styles.homeIconContainer}>
                  <TouchableOpacity>
                    <MaterialIcons name="router" size={30} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.iconText}>{device.deviceName}</Text>
                </View>
                <View style={styles.networkIconsContainer}>
                  <TouchableOpacity>
                    <AntDesign
                      name="earth"
                      style={styles.Btn}
                      size={18}
                      color="black"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Fontisto
                      name="wifi"
                      style={styles.Btn}
                      size={15}
                      color="black"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.Btn}>ON</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.Btn}>OFF</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.buttonsRow}>
                <SafeAreaView style={styles.container}>
                  {Array.from({ length: device.numOfDevice }, (_, index) => (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        // console.log(`${device.topic} ${index + 1}`);
                        sendMessage(device.topic, index);
                      }}
                    >
                      <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                  ))}
                </SafeAreaView>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No devices found.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceContainer: {
    borderWidth: 1,
    borderColor: Colors.btnbackgroundColor,
    borderRadius: 10,
    margin: 10,
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  homeIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  iconText: {
    marginLeft: 5,
    fontSize: 20,
  },
  networkIconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "50%",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    flexBasis: "22%",
    height: 80,
    backgroundColor: Colors.btnbackgroundColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
  Btn: {
    marginLeft: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 6,
  },
});

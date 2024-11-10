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

// MQTT client connection via WebSocket
const client = new Client(
  "ws://broker.hivemq.com:8000/mqtt", // WebSocket URL for HiveMQ broker
  `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [buttonStates, setButtonStates] = useState({}); // Track button states
  const [mqttConnected, setMqttConnected] = useState(false); // Track MQTT connection status
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
    const onSuccess = () => {
      console.log("Connected to MQTT broker");
      setMqttConnected(true); // Set MQTT connection state to true when connected
      client.subscribe("test/topic");

      client.onMessageArrived = (message) => {
        console.log("Received message:", message.payloadString);
        // Handle incoming message logic here
      };
    };

    const onFailure = (error) => {
      console.error("Connection failed:", error);
      setMqttConnected(false); // Set MQTT connection state to false on failure
    };

    client.connect({
      onSuccess,
      onFailure,
    });

    return () => {
      if (client.isConnected()) client.disconnect();
    };
  }, []);

  const sendMessage = (topic, deviceName, index, state = null) => {
    const deviceId = `${topic}/line${index + 1}`;
    const currentState = state || buttonStates[deviceId] || "off";
    const newState = currentState === "on" ? "off" : "on";
    const msg = `${deviceId}/${newState}`;

    if (client.isConnected()) {
      const message = new Message(msg);
      message.destinationName = topic;
      client.send(message);
      console.log("Message sent:", msg);

      setButtonStates((prevStates) => ({
        ...prevStates,
        [deviceId]: newState,
      }));
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

  const handleTopicOn = (topic) => {
    devices.forEach((device) => {
      if (device.topic === topic) {
        Array.from({ length: device.numOfDevice }, (_, index) => {
          sendMessage(device.topic, device.deviceName, index, "on");
        });
      }
    });
  };

  const handleTopicOff = (topic) => {
    devices.forEach((device) => {
      if (device.topic === topic) {
        Array.from({ length: device.numOfDevice }, (_, index) => {
          sendMessage(device.topic, device.deviceName, index, "off");
        });
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
                {mqttConnected && ( // Show the router icon only when MQTT is connected
                  <TouchableOpacity>
                    <MaterialIcons name="wifi" size={20} color="black" />
                  </TouchableOpacity>
                   )}
                  <TouchableOpacity onPress={() => handleTopicOn(device.topic)}>
                    <Text style={styles.Btn}>ON</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTopicOff(device.topic)}>
                    <Text style={styles.Btn}>OFF</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.buttonsRow}>
                <SafeAreaView style={styles.container}>
                  {Array.from({ length: device.numOfDevice }, (_, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.button,
                        {
                          backgroundColor:
                            buttonStates[
                              `${device.topic}/line${index + 1}`
                            ] === "on"
                              ? Colors.btnbackgroundColor // Choose a color when button is ON
                              : Colors.btnbackgroundColorLight, // Default color when button is OFF
                        },
                      ]}
                      onPress={() =>
                        sendMessage(device.topic, device.deviceName, index)
                      }
                    >
                      <Text style={styles.buttonText}>
                        {buttonStates[
                          `${device.topic}/${device.deviceName}/line${index + 1}`
                        ] === "on"
                          ? "Turn Off "
                          : "Turn On "}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </SafeAreaView>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDevicesText}>No devices found.</Text>
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
    fontSize: 10,
    color: "#000",
  },
  Btn: {
    marginLeft: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDevicesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textColor,
  },
});

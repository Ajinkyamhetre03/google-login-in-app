import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { auth } from "./../../configFireBase/configFirebase";
import { Client } from "paho-mqtt";
import { useEffect, useState } from "react";

// MQTT client connection via WebSocket
const client = new Client(
  "ws://broker.hivemq.com:8000/mqtt", // WebSocket URL for HiveMQ broker
  `mqtt-async-test-${parseInt(Math.random() * 100)}` // Unique client ID
);

function CustomDrawerContent(props) {
  const user = auth.currentUser;
  const route = useRouter();
  const [mqttConnected, setMqttConnected] = useState(false);

  // Handle MQTT connection when user logs in
  useEffect(() => {
    if (user) {
      // Connect to MQTT broker when the user is logged in
      client.connect({
        onSuccess: () => {
          console.log("Connected to MQTT broker");
          setMqttConnected(true);
        },
        onFailure: (err) => {
          console.error("Failed to connect to MQTT broker:", err);
        },
      });
    } else {
      // Disconnect from MQTT broker if the user is logged out
      if (mqttConnected) {
        client.disconnect();
        console.log("Disconnected from MQTT broker");
        setMqttConnected(false);
      }
    }
  }, [user]); // This effect runs whenever the `user` changes (login/logout)

  const logoutFromMQTT = () => {
    if (mqttConnected && client.isConnected()) {
      client.disconnect();
      console.log("Disconnected from MQTT broker");
      setMqttConnected(false); // Update connection state
      route.replace("/auth/signIn");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.profileDiv}>
          <Image
            style={styles.profileDivImg}
            source={require("./../../assets/images/Images/signIn.png")}
          />
        </View>
        {user && (
          <View style={styles.emailDiv}>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        )}
        <DrawerItemList {...props} />
        <DrawerItem
          label="Info"
          onPress={() => route.replace("/")}
          icon={({ color, size }) => (
            <Entypo name="info-with-circle" size={size} color={color} />
          )}
          labelStyle={{ marginLeft: -10 }}
        />
      </DrawerContentScrollView>
      <View style={styles.divFooter}>
        <TouchableOpacity onPress={logoutFromMQTT}>
          <Text style={styles.divFooterText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: Colors.btnbackgroundColor,
          drawerActiveTintColor: "#000",
          drawerInactiveTintColor: "#000",
          drawerLabelStyle: { marginLeft: -10 },
          headerStyle: { backgroundColor: Colors.backgroundColor },
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="AddDevice"
          options={{
            drawerLabel: "Add Device",
            title: "Add Device",
            drawerIcon: ({ color, size }) => (
              <Octicons name="device-mobile" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Account"
          options={{
            drawerLabel: "Account",
            title: "Account",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  profileDiv: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileDivImg: {
    height: "80%",
    width: "80%",
    borderRadius: 50,
  },
  emailDiv: {
    alignItems: "center",
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divFooter: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: Colors.btnbackgroundColor,
    margin: 10,
    borderRadius: 10,
  },
  divFooterText: {
    fontSize: 15,
    color: "#fff",
  },
});

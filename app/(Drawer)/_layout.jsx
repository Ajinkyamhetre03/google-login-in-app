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

function CustomDrawerContent(props) {
  const user = auth.currentUser;
  const route = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.profileDiv}>
          <Image
            style={styles.profileDivImg}
            source={require("./../../assets/images/Images/signIn.png")}
          />
        </View>
        <View style={styles.emailDiv}>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Info"
          onPress={() => route.replace("/")}
          icon={({ color, size }) => (
            <Entypo name="info-with-circle" size={size} color={color} />
          )}
          labelStyle={{ marginLeft: -10 }} // Small left margin for better alignment
        />
      </DrawerContentScrollView>
      <View style={styles.divFooter}>
        <TouchableOpacity onPress={() => route.replace("/auth/signIn")}>
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
              <Ionicons name="person" size={24} color="black" />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  profileDiv: {
    height: 200, // Adjusted for better compatibility on different devices
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileDivImg: {
    height: "80%", // Adjusted for image responsiveness
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

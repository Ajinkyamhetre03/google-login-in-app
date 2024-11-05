import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer options={{}}>
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "home",
            title: "APP",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="AddDevice"
          options={{
            drawerLabel: "Add Device",
            title: "APP",
            drawerIcon: ({ color, size }) => (
              <Octicons name="device-mobile" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

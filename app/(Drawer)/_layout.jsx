import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer options={{ title: "app" }}>
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "home",
            title: "APP",
          }}
        />
        <Drawer.Screen
          name="AddDevice"
          options={{
            drawerLabel: "Add Device",
            title: "APP",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

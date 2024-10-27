import { Text, View } from "react-native";
import Login from "../components/myComponents/Login";
import { Redirect } from "expo-router";
import { auth } from "../configFireBase/configFirebase";

export default function Index() {
  const user = auth.currentUser;

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {user ? <Redirect href={"/(Drawer)/home"} /> : <Login />}
    </View>
  );
}

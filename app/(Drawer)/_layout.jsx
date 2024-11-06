import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
// import { CustomDrawerContent } from "./../../components/myComponents/CustomDrawerContent";
import { Colors } from "../../constants/Colors";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {  useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

if (user !== null) {
  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
  const uid = user.uid;
}

const NotAvableEmail ='no Email avable';
const NotAvablePhotoURL = require('../../assets/images/Images/signIn.png');


function CustomDrawerContent(props) {
  const route = useRouter();
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.divProfile}>
        <Image
         style={styles.profileImage}
         source={user && user.photoURL ? { uri: user.photoURL } : NotAvablePhotoURL}
        />
        </View>
        <View style={styles.divName}>
          <Text style={styles.name}>{user.email? user.email: NotAvableEmail }</Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem label="Info"  onPress={() => route.replace("/")} 
            icon={({ color, size }) => (<Entypo name="info-with-circle" size={size} color={color} />)} 
              labelStyle={{ marginLeft: -20 }} // Corrected prop and style syntax
            />
      </DrawerContentScrollView>
      <View style={styles.divFooter}>
        <TouchableOpacity onPress={() => route.replace("/auth/signIn")}>
        <Text style={styles.divFooterText}>Logout </Text>
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
          drawerLabelStyle: { marginLeft: -20 },
          headerStyle:{backgroundColor:Colors.backgroundColor}
        }}
      >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.backgroundColor,
  },
  divFooter: {
    alignItems: "center",
    height: "5%",
    justifyContent: "center",
    fontSize: 30,
    backgroundColor:Colors.btnbackgroundColor,
    margin:10,
    borderRadius:10
  },
  divFooterText: {
    fontSize: 15,
  },
  divProfile: {
    width: "100%",
    height: 200, 
    alignItems: "center",
    justifyContent: "center",
    marginTop:'10%'
  },
  profileImage: {
    width: 250, 
    height: 250,
    borderRadius: 50,
  },
  divName:{
    width:'100%',
    alignItems:"center",
    justifyContent:"center",
    padding:'5%'
  },
  name:{
    fontSize:15
  }
});

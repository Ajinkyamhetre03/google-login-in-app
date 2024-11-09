import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import Device from "../../components/myComponents/device";
import { Colors } from "../../constants/Colors";
import { db, auth } from "./../../configFireBase/configFirebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

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
          <Device
            key={index}
            btnNumber={device.numOfDevice}
            topic={device.topic}
            buttontype={device.buttontype}
            password={device.password}
            wifiname={device.wifiname}
            deviceName={device.deviceName}
          />
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No devices found.
        </Text>
      )}
    </ScrollView>
  );
}

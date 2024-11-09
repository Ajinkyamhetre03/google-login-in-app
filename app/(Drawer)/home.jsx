import { ScrollView, Text } from "react-native";
import React from "react";
import Device from "../../components/myComponents/device";
import { Colors } from "../../constants/Colors";
import { db, auth } from "./../../configFireBase/configFirebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { TouchableOpacity } from "react-native";

const user = auth.currentUser;

const data = async () => {
  const querySnapshot = await getDocs(collection(db, user.email));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.data().topic} = ${doc.data().numOfDevice} `);
  });
};

export default function Home() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundColor }}>
      {/* <Device />
      <Device /> */}
      <TouchableOpacity onPress={data}>
        <Text> Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

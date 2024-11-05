import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Image, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function StyledImage() {
  const route = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/Images/homeScreen.png")}
        style={styles.image}
        resizeMode="cover"
      ></Image>
      <View>
        <Text style={styles.title}>Welcome to Smart Home Automation!</Text>
        <Text style={styles.subTitle}>
          Bringing comfort and ease to your life with our smart technology.
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => route.push("/auth/signIn")}>
          <Text style={styles.btn}>Login </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: Colors.backgroundColor,
    padding: 20,
  },
  image: {
    width: "100%",
    height: "30%",
    marginTop: "60%",
  },
  title: {
    fontSize: 30,
    marginTop: "15%",
    fontWeight: "800",
  },
  subTitle: {
    fontSize: 15,
    marginTop: "2%",
    textAlign: "center",
  },
  btn: {
    marginTop: "50%",
    backgroundColor: Colors.btnbackgroundColor,
    fontSize: 20,
    paddingHorizontal: 100,
    paddingVertical: 10,
    borderRadius: 10,
    fontWeight: "600",
    color: "#4b4e4e",
  },
});

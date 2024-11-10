import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Colors } from "../../constants/Colors";

export default function Device({ btnNumber, deviceName, topic }) {
  return (
    <View style={styles.centerContainer}>
      <View style={styles.deviceContainer}>
        <View style={styles.iconRow}>
          <View style={styles.homeIconContainer}>
            <TouchableOpacity>
              <MaterialIcons name="router" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.iconText}>{deviceName}</Text>
          </View>
          <View style={styles.networkIconsContainer}>
            <TouchableOpacity>
              <AntDesign
                name="earth"
                style={styles.Btn}
                size={18}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Fontisto
                name="wifi"
                style={styles.Btn}
                size={15}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.Btn}>ON</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.Btn}>OFF</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonsRow}>
          <SafeAreaView style={styles.container}>
            {Array.from({ length: btnNumber }, (_, index) => (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log(`${topic} ${index + 1}`);
                }}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            ))}
          </SafeAreaView>
        </View>
      </View>
    </View>
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
    fontSize: 16,
    color: "#000",
  },
  Btn: {
    marginLeft: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 6,
  },
});

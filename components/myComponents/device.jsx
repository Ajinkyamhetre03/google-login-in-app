import { View, Text, StyleSheet, ScrollViewBase, SafeAreaView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';

const Btn = () => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("its working onpress");
        }}
        onLongPress={() => {
          console.log("its working onlongpress");
        }}
      >
        <Text style={styles.buttonText}>Create Account </Text>
      </TouchableOpacity>
    );
  };
  


const btnNumber = 4;

export default function device() {
  return (
    <View style={{borderRadius:1,backgroundColor:'#CC2B52', marginTop:10, borderRadius:20, }}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
            <TouchableOpacity> 
            <MaterialCommunityIcons name="devices" size={30} color="black" />
            </TouchableOpacity>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <TouchableOpacity> 
            <AntDesign name="earth" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity> 
            <Fontisto name="wifi" size={24} color="black" />
            </TouchableOpacity>
            </View>
      </View>
      <View style={{flexDirection:'row'}}>
      <SafeAreaView style={styles.container}>
      {Array.from({ length: btnNumber }, (_, index) => (
        <Btn key={index} />
      ))}
    </SafeAreaView>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows buttons to wrap to the next row
    justifyContent: "space-around", // Distribute space around buttons
  },
  button: {
    borderWidth: null,
    height: 80,
    width: "20%", // Set width to allow 4 buttons per row
    backgroundColor: "#AF1740",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
});

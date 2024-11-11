import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configFireBase/configFirebase";
import { Colors } from "../../../constants/Colors";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const route = useRouter();
  const Navigation = useNavigation();
  useEffect(() => {
    Navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        route.replace("/(Drawer)/home");
        console.log("sign up successful");
      })
      .catch((error) => {
        const errorCode = error.code;
        ToastAndroid.show(errorCode, ToastAndroid.BOTTOM);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("./../../../assets/images/Images/signUp.png")}
        />
      </View>

      <View style={styles.divInpu}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.btnSignIn} onPress={signup}>
        <Text style={styles.buttonText}> Create Account </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnAccount}
        onPress={() => route.replace("/auth/signIn")}
      >
        <Text style={styles.buttonText}> Already have an account </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundColor,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: "5%",
    marginTop: "15%",
    textAlign: "center",
  },
  imageContainer: {
    width: "80%", // Adjusted width for responsiveness
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  divInpu: {
    width: "100%",
    marginTop: "10%",
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#747477",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
  btnSignIn: {
    marginTop: "5%",
    backgroundColor: Colors.btnbackgroundColor,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  btnAccount: {
    marginTop: 20,
    backgroundColor: Colors.btnbackgroundColor,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

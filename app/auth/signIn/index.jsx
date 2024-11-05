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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configFireBase/configFirebase";
import { Colors } from "../../../constants/Colors";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const route = useRouter();
  const Navigation = useNavigation();
  useEffect(() => {
    Navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const signin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        route.replace("/(Drawer)/home");
        const user = userCredential.user;
        console.log("sign in sucessfull");

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        ToastAndroid.show(errorCode, ToastAndroid.BOTTOM);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Image
        style={styles.image}
        source={require("./../../../assets/images/Images/signIn.png")}
      ></Image>

      <View style={styles.divInpu}>
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

      <TouchableOpacity style={styles.btnSignIn} onPress={signin}>
        <Text style={styles.buttonText}>Sign In </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnAccount}
        onPress={() => route.replace("/auth/signUp")}
      >
        <Text style={styles.buttonText}>Create a New Account </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: 16,
    backgroundColor: Colors.backgroundColor,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: "20%",
  },
  image: {
    width: "100%",
    height: "30%",
    marginTop: "10%",
  },
  divInpu: {
    width: "100%",
    marginTop: "15%",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#747477",
    borderRadius: 8,
    marginBottom: "5%",
  },
  btnSignIn: {
    marginTop: "3%",
    backgroundColor: Colors.btnbackgroundColor,
    padding: 12,
    borderRadius: 8,
    fontWeight: "600",
    color: "#4b4e4e",
    width: "100%",
  },
  btnAccount: {
    marginTop: "20%",
    backgroundColor: Colors.btnbackgroundColor,
    padding: 12,
    borderRadius: 8,
    fontWeight: "600",
    color: "#4b4e4e",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
});

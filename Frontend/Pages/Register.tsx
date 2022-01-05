import React, { useState } from "react";
const { routes } = require("../routes");
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
} from "react-native";
import { Link, useHistory } from "react-router-native";
import AuthAPI from "../api/auth";
import TokenAPI from "../api/tokens";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();

  function handleRegister() {
    if (password === confirmPassword) {
      AuthAPI.register(username, password)
        .then((res) => history.push(routes.login))
        .catch((err) =>
          err.response?.status === 409
            ? alert(err.response.data.message)
            : console.log(err),
        );
    } else {
      alert("Passwords do not match!");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          autoCapitalize={"none"}
          onChangeText={(username) => setUsername(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          autoCapitalize={"none"}
          textContentType={"newPassword"}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Confirm Password"
          autoCapitalize={"none"}
          textContentType={"newPassword"}
          secureTextEntry={true}
          onChangeText={(password) => setConfirmPassword(password)}
        />
      </View>
      <Link component={TouchableOpacity} to={routes.login}>
        <Text style={styles.alreadyRegistered}>Already registered?</Text>
      </Link>
      <TouchableOpacity onPress={handleRegister} style={styles.RegisterButton}>
        <Text>REGISTER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    backgroundColor: "lightgrey",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    flex: 1,
    width: "100%",
    textAlign: "center",
  },
  alreadyRegistered: {
    height: 30,
    marginBottom: 30,
  },
  RegisterButton: {
    width: "50%",
    borderRadius: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkgrey",
  },
});

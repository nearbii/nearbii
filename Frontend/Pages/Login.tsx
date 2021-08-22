import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-native";
const { routes } = require("../routes");
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
} from "react-native";
import { AuthContext } from "../Auth";

export interface IauthLoginResp {
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  //TODO:
  //@ts-ignore
  const { authLogin } = useContext(AuthContext);

  function handleLogin() {
    authLogin(username, password)
      .then(({ accessToken, refreshToken }: IauthLoginResp) => {
        if (accessToken) {
          history.push("/test");
        }
      })
      .catch((err: any) => {
        console.log(err);
        err.response.status === 403
          ? alert(err.response.data.message)
          : console.log(err);
      });
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
          textContentType={"password"}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <Link component={TouchableOpacity} to={routes.register}>
        <Text style={styles.notRegistered}>Not registered?</Text>
      </Link>
      <TouchableOpacity onPress={handleLogin} style={styles.LoginButton}>
        <Text>LOGIN</Text>
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
  notRegistered: {
    height: 30,
    marginBottom: 30,
  },
  LoginButton: {
    width: "50%",
    borderRadius: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkgrey",
  },
});

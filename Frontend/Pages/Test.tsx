import React, { useContext } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
} from "react-native";

import { AuthContext } from "../Auth";

export default function Test() {
  //TODO:
  //@ts-ignore
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <SafeAreaView
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <Text>authenticated: {`${isAuthenticated}`}</Text>
    </SafeAreaView>
  );
}

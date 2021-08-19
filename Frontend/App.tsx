import { StatusBar } from "expo-status-bar";
import React from "react";
import Login from "./Pages/Login";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return <Login />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

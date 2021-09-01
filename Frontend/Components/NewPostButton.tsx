import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface INewPostButtonProps {
  size: number;
  onPress: () => void;
}

export default function NewPostButton({ size, onPress }: INewPostButtonProps) {
  const styles = StyleSheet.create({
    newPost: {
      color: "white",
      backgroundColor: "green",
      borderRadius: size * 0.7,
      overflow: "hidden",
      alignSelf: "flex-end",
      padding: "2%",
      position: "absolute",
      bottom: 0,
      right: 30,
    },
    buttonBackground: {},
  });

  return (
    <TouchableOpacity style={styles.buttonBackground} onPress={onPress}>
      <MaterialIcons name="create" style={styles.newPost} size={size} />
    </TouchableOpacity>
  );
}

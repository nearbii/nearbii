import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface INewPostButtonProps {
  size: number;
}

export default function NewPostButton({ size }: INewPostButtonProps) {
  const styles = StyleSheet.create({
    newPost: {
      color: "white",
      backgroundColor: "green",
      borderRadius: size * 0.7,
      overflow: "hidden",
      alignSelf: "flex-end",
      padding: "2%",
      position: "absolute",
      bottom: 20,
      right: 20,
    },
    buttonBackground: {},
  });

  return (
    <TouchableOpacity style={styles.buttonBackground}>
      <MaterialIcons
        borderRadius={100}
        name="create"
        style={styles.newPost}
        size={size}
      />
    </TouchableOpacity>
  );
}

import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface IProps {
  onUp: () => void;
  score: number;
  onDown: () => void;
}

export default function VoteButtons({ onUp, onDown, score }: IProps) {
  return (
    <View style={styles.buttons}>
      <TouchableOpacity onPress={onUp}>
        <MaterialIcons name="expand-less" size={28} />
      </TouchableOpacity>
      <Text>{score}</Text>
      <TouchableOpacity onPress={onDown}>
        <MaterialIcons name="expand-more" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    alignItems: "center",
  },
});

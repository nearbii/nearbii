import React from "react";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
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
        <Text>+{/* <ExpandLess /> */}</Text>
      </TouchableOpacity>
      <Text>{score}</Text>
      <TouchableOpacity onPress={onDown}>
        <Text>-{/* <ExpandMore /> */}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    alignItems: "center",
    //alignSelf: "flex-end",
  },
});

import React from "react";
import { Card } from "react-native-elements";
import { TouchableOpacity, StyleSheet, Text, View, Button } from "react-native";

interface IProps {
  sortPostsBy: string;
  setSortPostsBy: (arg0: string) => void;
}

export default function FeedHeader({ sortPostsBy, setSortPostsBy }: IProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[
          styles.feedButton,
          styles.leftFeedButton,
          sortPostsBy === "new" && styles.activeSortPostsBy,
        ]}
        onPress={() => setSortPostsBy("new")}
      >
        <Text style={styles.text}>New</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.feedButton,
          styles.rightFeedButton,
          sortPostsBy === "hot" && styles.activeSortPostsBy,
        ]}
        onPress={() => setSortPostsBy("hot")}
      >
        <Text style={styles.text}>Hot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "3%",
  },
  feedButton: {
    backgroundColor: "gainsboro",
    padding: 5,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "grey",
    width: "15%",
  },
  rightFeedButton: {
    borderRightWidth: 2,
    borderLeftWidth: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  leftFeedButton: {
    borderLeftWidth: 2,
    borderRightWidth: 0.5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  text: {
    textAlign: "center",
  },
  activeSortPostsBy: {
    backgroundColor: "lightsteelblue",
  },
});

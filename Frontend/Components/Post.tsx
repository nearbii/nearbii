import React, { useState } from "react";
import { Card } from "react-native-elements";
import { StyleSheet, Text, View } from "react-native";
import VoteButtons from "./VoteButtons";

import { IPost } from "../Interfaces";
import PostApi from "../api/posts";

interface IProps {
  post: IPost;
  refreshPosts: () => void;
}

export default function Post(props: IProps) {
  const { post, refreshPosts } = props;
  const { author, date, text, id, score } = post;
  const [displayScore, setDisplayScore] = useState(score);

  const increaseScore = () => {
    setDisplayScore(displayScore + 1);
    PostApi.votePostUp(id)
      .then((res) => {
        refreshPosts();
      })
      .catch((err) => console.log(err));
  };

  const decreaseScore = () => {
    setDisplayScore(displayScore - 1);
    PostApi.votePostDown(id)
      .then((res) => {
        refreshPosts();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.mainView}>
        <View style={styles.leftContent}>
          <Text>{text}</Text>
        </View>
        <View style={styles.rightContent}>
          <VoteButtons
            onUp={increaseScore}
            score={score}
            onDown={decreaseScore}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 0,
  },
  leftContent: { flex: 1, flexDirection: "row", justifyContent: "flex-start" },
  rightContent: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },
  mainView: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
});

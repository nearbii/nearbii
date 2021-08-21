import React, { useContext, useState } from "react";
import PostApi from "../api/posts";

import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  TextInput,
} from "react-native";
import { AuthContext } from "../Auth";
import { readAccessToken } from "../clientUtils";

export default function Test() {
  //@ts-ignore
  const { isAuthenticated } = useContext(AuthContext);
  const [postText, setPostText] = useState("");

  const handleCreatePost = () => {
     PostApi.createPost(postText);
  };

  return (
    <SafeAreaView
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <Text>authenticated: {`${isAuthenticated}`}</Text>
      <Button title={"console log token"} onPress={readAccessToken} />
      <TextInput
        placeholder="create post"
        onChangeText={(postText) => setPostText(postText)}
      />
      <Button title={"create post"} onPress={handleCreatePost} />
    </SafeAreaView>
  );
}

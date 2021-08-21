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
import AuthApi from "../api/auth";

export default function Test() {
  //@ts-ignore
  const { isAuthenticated } = useContext(AuthContext);
  const [postText, setPostText] = useState("");

  const handleCreatePost = () => {
    PostApi.createPost(postText);
  };

  const handleRefreshToken = () => {
    AuthApi.updateAccessToken();
  };

  return (
    <SafeAreaView
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <Text>authenticated: {`${isAuthenticated}`}</Text>
      <TextInput
        placeholder="create post"
        onChangeText={(postText) => setPostText(postText)}
      />
      <Button title={"create post"} onPress={handleCreatePost} />
      <Button title={"refresh token"} onPress={handleRefreshToken} />
    </SafeAreaView>
  );
}

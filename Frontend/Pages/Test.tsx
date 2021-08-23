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
import { readAccessToken, readAccessTokenExpiryTime } from "../clientUtils";
import AuthApi from "../api/auth";

export default function Test() {
  //@ts-ignore
  const { isAuthenticated } = useContext(AuthContext);
  const [postText, setPostText] = useState("");
  const [accToken, setAccToken] = useState("");

  const handleCreatePost = () => {
    PostApi.createPost(postText).then((res) => console.log(res));
  };

  const handleRefreshToken = () => {
    AuthApi.updateAccessToken();
  };

  async function updateDisplayToken(): Promise<void> {
    setAccToken(await readAccessToken());
  }

  return (
    <SafeAreaView
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <Text>acc token: {accToken}</Text>
      <Text>authenticated: {`${isAuthenticated}`}</Text>
      <TextInput
        placeholder="create post"
        onChangeText={(postText) => setPostText(postText)}
      />
      <Button title={"create post"} onPress={handleCreatePost} />
      <Button title={"refresh token"} onPress={handleRefreshToken} />
      <Button
        title={"update displayed access token"}
        onPress={updateDisplayToken}
      />
      <Button
        title={"console log acc token expiry time"}
        onPress={async () => console.log(await readAccessTokenExpiryTime())}
      />
    </SafeAreaView>
  );
}

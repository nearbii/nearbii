import React, { useContext, useState, useEffect } from "react";
import PostApi from "../api/posts";
import * as Location from "expo-location";

import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  TextInput,
  View,
} from "react-native";
import { AuthContext } from "../Auth";
import { readAccessToken, readAccessTokenExpiryTime } from "../clientUtils";
import AuthApi from "../api/auth";
import { useHistory } from "react-router-native";
import { LocationObject } from "expo-location";
import LocationAPI from "../api/location";
import { ILocation } from "../Interfaces";
const { routes } = require("../routes");

export default function Test() {
  const history = useHistory();
  //@ts-ignore
  const { isAuthenticated } = useContext(AuthContext);
  const [postText, setPostText] = useState("");
  const [accToken, setAccToken] = useState("");
  const [location, setLocation] = useState<LocationObject | null>(null);

  const handleCreatePost = () => {
    PostApi.createPost(postText);
  };

  const handleRefreshToken = () => {
    AuthApi.updateAccessToken();
  };

  async function updateDisplayToken(): Promise<void> {
    setAccToken(await readAccessToken());
  }

  useEffect(() => {
    LocationAPI.getLocation().then((location: LocationObject) =>
      setLocation(location)
    );
  }, []);

  let text = "Waiting..";
  if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <View>
        <Text>location = {text}</Text>
      </View>
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
      <Button title={"go to feed"} onPress={() => history.push(routes.feed)} />
    </SafeAreaView>
  );
}

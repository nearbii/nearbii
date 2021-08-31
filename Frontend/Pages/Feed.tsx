import React, { useState } from "react";

import {
  StyleSheet,
  SafeAreaView,
  Button,
  ScrollView,
  View,
  RefreshControl,
} from "react-native";
import { useEffect } from "react";
import { useHistory } from "react-router-native";
import PostApi from "../api/posts";
import Post from "../Components/Post";
import { ILocation, IPost } from "../Interfaces";
import LocationAPI from "../api/location";
import NewPostButton from "../Components/NewPostButton";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const history = useHistory();

  const [location, setLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshPosts().then(() => setRefreshing(false));
  }, []);

  async function refreshPosts() {
    const location = await LocationAPI.getLocation();
    return PostApi.getPosts(location).then((res) => {
      setPosts(res.data.posts);
    });
  }

  useEffect(() => {
    refreshPosts();
    return () => {};
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post: IPost) => {
          return <Post post={post} key={post.id} refreshPosts={refreshPosts} />;
        })}
        <Button title={"back to test"} onPress={() => history.push("./test")} />
      </ScrollView>
      <View>
        <NewPostButton size={45} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
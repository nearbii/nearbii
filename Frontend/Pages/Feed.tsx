import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  SafeAreaView,
  Button,
  ScrollView,
  View,
  RefreshControl,
} from "react-native";
import { useHistory } from "react-router-native";
import PostApi from "../api/posts";
import Post from "../Components/Post";
import { ILocation, IPost } from "../Interfaces";
import LocationAPI from "../api/location";
import NewPostButton from "../Components/NewPostButton";
import NewPostModal from "../Components/NewPostModal";
import { LocationObject } from "expo-location";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const history = useHistory();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshPosts().then(() => setRefreshing(false));
  }, []);

  async function refreshPosts() {
    const location = await LocationAPI.getLocation();
    return PostApi.getPosts(location)
      .then((res) => {
        setPosts(res.data.posts);
      })
      .catch((e) => console.log(e));
  }

  const handleCreatePost = () => {
    if (postText.length === 0) return;
    PostApi.createPost(postText)
      .then(() => {
        setRefreshing(true);
        refreshPosts().then(() => setRefreshing(false));
        setPostText("");
        setModalVisible(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    refreshPosts();
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
        <NewPostButton size={45} onPress={() => setModalVisible(true)} />
        <NewPostModal
          modalVisible={modalVisible}
          closeModal={() => setModalVisible(false)}
          postText={postText}
          setPostText={setPostText}
          handleCreatePost={handleCreatePost}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

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
import FeedHeader from "../Components/FeedHeader";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [sortPostsBy, setSortPostsBy] = useState("new");
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

  useEffect(() => {
    if (sortPostsBy === "new") {
      setPosts(
        posts.sort((postA: IPost, postB: IPost) => postB.score - postA.score)
      );
    } else if (sortPostsBy === "hot") {
      setPosts(
        posts.sort((postA: IPost, postB: IPost) => postB.date - postA.date)
      );
    }
  }, [sortPostsBy, posts]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FeedHeader sortPostsBy={sortPostsBy} setSortPostsBy={setSortPostsBy} />
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

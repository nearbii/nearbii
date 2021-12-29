import React from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface INewPostModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  postText: string;
  setPostText: (arg0: string) => void;
  handleCreatePost: () => void;
}

export default function NewPostModal({
  modalVisible,
  closeModal,
  postText,
  setPostText,
  handleCreatePost,
}: INewPostModalProps) {
  const maxLength: number = process.env.POSTMAXLENGTH
    ? +process.env.POSTMAXLENGTH
    : 40;

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.pressableStart}
              onPress={() => closeModal()}
            >
              <MaterialIcons
                name="close"
                style={styles.buttonClose}
                size={25}
              />
            </Pressable>
            <TextInput
              onChangeText={(text) => setPostText(text)}
              placeholder="What've you got to say?"
              textAlign="center"
              maxLength={maxLength}
            />
            <View style={styles.sameLine}>
              <Text style={styles.count}>
                {postText.length}/{maxLength}
              </Text>
              <Pressable onPress={handleCreatePost}>
                <MaterialIcons
                  name="send"
                  style={styles.buttonSend}
                  size={20}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonClose: {
    color: "red",
  },
  buttonSend: {
    color: "green",
  },
  pressableStart: {
    alignSelf: "flex-start",
  },
  sameLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  count: {
    color: "grey",
  },
});

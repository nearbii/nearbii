import { AsyncStorage } from "react-native";

export const storeAccessToken = async (val: string) => {
  try {
    await AsyncStorage.setItem("accessToken", val);
  } catch (error) {
    console.log(error);
  }
};

export const readAccessToken = async () => {
  try {
    const value = await AsyncStorage.getItem("accessToken");
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};

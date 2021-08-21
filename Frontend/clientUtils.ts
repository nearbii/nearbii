import { AsyncStorage } from "react-native";

export const storeToken = async (key: string, val: string) => {
  try {
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.log(error);
    // Error saving data
  }
};

export const readToken = async () => {
  try {
    const value = await AsyncStorage.getItem("authToken");
    if (value !== null) {
      // We have data!!
      console.log(value);
      return value;
    }
  } catch (error) {
    // Error retrieving data
  }
};

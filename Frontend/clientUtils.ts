//import AsyncStorage from "@react-native-community/async-storage";
//import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAccessToken = async (val: string) => {
  await storeKeyValue("accessToken", val);
};

export const readAccessToken = async () => {
  return await readValue("accessToken");
};

export const storeRefreshToken = async (val: string) => {
  await storeKeyValue("refreshToken", val);
};

export const readRefreshToken = async () => {
  return await readValue("refreshToken");
};

export const storeAccessTokenExpiryTime = async (val: number) => {
  return await storeKeyValue("accessTokenExpiryTime", `${val}`);
};

export const readAccessTokenExpiryTime = async () => {
  const expiryString = await readValue("accessTokenExpiryTime");
  return expiryString && +expiryString;
};

const readValue = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};

const storeKeyValue = async (key: string, val: string) => {
  try {
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.log(error);
  }
};

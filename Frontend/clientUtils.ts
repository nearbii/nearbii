import { AsyncStorage } from "react-native";

export const storeAccessToken = async (val: string) => {
  await storeToken("accessToken", val);
};

export const readAccessToken = async () => {
  return await readToken("accessToken");
};

export const storeRefreshToken = async (val: string) => {
  await storeToken("refreshToken", val);
};

export const readRefreshToken = async () => {
  return await readToken("refreshToken");
};

const readToken = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};

const storeToken = async (key: string, val: string) => {
  try {
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.log(error);
  }
};

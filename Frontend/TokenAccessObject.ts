//import AsyncStorage from "@react-native-community/async-storage";
//import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAccessToken = async (val: string) => {
  await storeKeyValue("accessToken", val);
};

export async function readAccessToken(): Promise<string> {
  return await readValue("accessToken");
}

export async function storeRefreshToken(val: string): Promise<void> {
  await storeKeyValue("refreshToken", val);
}

export async function readRefreshToken(): Promise<string> {
  return await readValue("refreshToken");
}

export async function storeAccessTokenExpiryTime(val: number): Promise<void> {
  return await storeKeyValue("accessTokenExpiryTime", `${val}`);
}

export async function readAccessTokenExpiryTime(): Promise<number> {
  const expiryString = await readValue("accessTokenExpiryTime");
  if (expiryString) {
    return +expiryString;
  } else {
    throw new Error("Couldnt find the access token expiry time!");
  }
}

async function readValue(key: string): Promise<string> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    throw new Error(`Couldn't find value for key '${key}'`);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function storeKeyValue(key: string, val: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.log(error);
  }
}

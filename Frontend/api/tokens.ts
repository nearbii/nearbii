import AsyncStorage from "@react-native-async-storage/async-storage";

export default class TokenAPI {
  public static async storeAccessToken(val: string): Promise<void> {
    await this.storeKeyValue("accessToken", val);
  }

  public static async readAccessToken(): Promise<string> {
    return await this.readValue("accessToken");
  }

  public static async storeRefreshToken(val: string): Promise<void> {
    await this.storeKeyValue("refreshToken", val);
  }

  public static async readRefreshToken(): Promise<string> {
    return await this.readValue("refreshToken");
  }

  public static async storeAccessTokenExpiryTime(val: number): Promise<void> {
    return await this.storeKeyValue("accessTokenExpiryTime", `${val}`);
  }
  public static async readAccessTokenExpiryTime(): Promise<number> {
    const expiryString = await this.readValue("accessTokenExpiryTime");
    if (expiryString) {
      return +expiryString;
    } else {
      throw new Error("Couldnt find the access token expiry time!");
    }
  }

  public static async readValue(key: string): Promise<string> {
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

  public static async storeKeyValue(key: string, val: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      console.log(error);
    }
  }
}

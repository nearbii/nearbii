import StorageAPI from "./storage";

export default class TokenAPI {
  public static async storeAccessToken(val: string): Promise<void> {
    await StorageAPI.storeKeyValue("accessToken", val);
  }

  public static async readAccessToken(): Promise<string> {
    return await StorageAPI.readValue("accessToken");
  }

  public static async storeRefreshToken(val: string): Promise<void> {
    await StorageAPI.storeKeyValue("refreshToken", val);
  }

  public static async readRefreshToken(): Promise<string> {
    return await StorageAPI.readValue("refreshToken");
  }

  public static async storeAccessTokenExpiryTime(val: number): Promise<void> {
    return await StorageAPI.storeKeyValue("accessTokenExpiryTime", `${val}`);
  }
  public static async readAccessTokenExpiryTime(): Promise<number> {
    const expiryString = await StorageAPI.readValue("accessTokenExpiryTime");
    if (expiryString) {
      return +expiryString;
    } else {
      throw new Error("Couldnt find the access token expiry time!");
    }
  }
}

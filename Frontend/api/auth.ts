const { apiRoutes } = require("../apiRoutes");
import { AxiosResponse } from "axios";
import BaseApi from ".";
import {
  readAccessToken,
  readRefreshToken,
  storeAccessToken,
  storeAccessTokenExpiryTime,
} from "../clientUtils";

export default class AuthApi extends BaseApi {
  constructor() {
    super();
  }
  public static login(
    username: string,
    password: string
  ): Promise<AxiosResponse> {
    const { login } = apiRoutes;
    return this.post(login, { username, password });
  }
  public static register(
    username: string,
    password: string
  ): Promise<AxiosResponse> {
    const { register } = apiRoutes;
    return this.post(register, { username, password });
  }
  public static async updateAccessToken(): Promise<{
    accessToken: string;
    expiresAt: number;
  }> {
    const { token } = apiRoutes;
    const refreshToken = await readRefreshToken();
    return this.post(token, { refreshToken })
      .then(({ data }: any) => {
        console.log("here");
        storeAccessToken(data.accessToken);
        storeAccessTokenExpiryTime(data.expiresAt);
        return data;
      })
      .catch((err: Error) => {
        throw err;
      });
  }
}

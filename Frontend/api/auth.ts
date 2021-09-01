const { apiRoutes } = require("../apiRoutes");
import { AxiosResponse } from "axios";
import BaseAPI from ".";
import TokenAPI from "./tokens";

export default class AuthAPI extends BaseAPI {
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
    const refreshToken = await TokenAPI.readRefreshToken();
    return this.post(token, { refreshToken })
      .then(({ data }: any) => {
        TokenAPI.storeAccessToken(data.accessToken);
        TokenAPI.storeAccessTokenExpiryTime(data.expiresAt);
        return data;
      })
      .catch((err: Error) => {
        throw err;
      });
  }
}

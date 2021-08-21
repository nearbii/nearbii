const { apiRoutes } = require("../apiRoutes");
import { AxiosResponse } from "axios";
import BaseApi from ".";
import {
  readAccessToken,
  readRefreshToken,
  storeAccessToken,
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
  public static async updateAccessToken(): Promise<any> {
    const { token } = apiRoutes;
    const refreshToken = await readRefreshToken();
    return this.post(token, { refreshToken })
      .then(({ data }: any) => {
        storeAccessToken(data.accessToken);
        return data;
      })
      .catch((err: Error) => console.log(err));
  }
}

import axios, { AxiosResponse } from "axios";
import { readAccessToken, readAccessTokenExpiryTime } from "../clientUtils";
const { apiRoutes } = require("../apiRoutes");
import AuthApi from "./auth";

//change to your local ip
const HOST = process.env.HOST || "http://192.168.0.6";
const PORT = process.env.PORT || 5000;

interface IConfig {
  headers: { "content-type": string; Authorization: string };
}

//get new access token if it expires
axios.interceptors.request.use(
  async (config) => {
    const timeNow = new Date().getTime();

    config.headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${await readAccessToken()}`,
    };

    if (config.url?.includes(apiRoutes.token)) {
      return config;
    }

    return await readAccessTokenExpiryTime()
      .then((expiryTime) => {
        if (timeNow > expiryTime) {
          return AuthApi.updateAccessToken().then(async (data) => {
            config.headers.Authorization = `Bearer ${data.accessToken}`;
            return config;
          });
        }
      })
      .then((newConf) => {
        return config;
      })
      .catch((err) => {
        throw err;
      });
  },
  (err) => {
    throw err;
  }
);

export default class BaseAPI {
  static async get(endpoint: string): Promise<AxiosResponse> {
    return axios.get(`${HOST}:${PORT}${endpoint}`);
  }

  static async post(endpoint: string, body: any): Promise<AxiosResponse> {
    return axios.post(`${HOST}:${PORT}${endpoint}`, body);
  }
}

import axios, { AxiosResponse } from "axios";
import { readAccessToken, readAccessTokenExpiryTime } from "../TokenAccessObject";
const { apiRoutes } = require("../apiRoutes");
import AuthApi from "./auth";

//change to your local ip
const HOST = process.env.HOST || "http://127.0.0.1";
const PORT = process.env.PORT || 5000;

interface IConfig {
  headers: { "content-type": string; Authorization: string };
}

//get new access token if it expires
axios.interceptors.request.use(
  async (config) => {
    config.headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${await readAccessToken()}`,
    };

    if (config.url?.includes(apiRoutes.token)) {
      return config;
    }

    const timeNow = new Date().getTime();

    return await readAccessTokenExpiryTime()
      .then((expiryTime) => {
        if (timeNow > expiryTime) {
          return AuthApi.updateAccessToken()
            .then(async (data) => {
              config.headers.Authorization = `Bearer ${data.accessToken}`;
              return config;
            })
            .catch((err) => console.log(err));
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

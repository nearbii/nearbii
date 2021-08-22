import axios, { AxiosResponse } from "axios";
import { access } from "fs";
import { stringify } from "querystring";
import { readAccessToken, readRefreshToken } from "../clientUtils";

//change to your local ip
const HOST = process.env.HOST || "http://192.168.1.2";
const PORT = process.env.PORT || 5000;

interface IConfig {
  headers: { "content-type": string; Authorization: string };
}

//get new access token if it expires
// axios.interceptors.request.use(
//   //@ts-ignore
//   async (config) => {
//     //const expireAt = localStorage.getItem("expiresAt");
//     console.log("hello this is axios", await readRefreshToken());
//     // let token = localStorage.getItem('authToken');
//     // if (dayjs(expireAt).diff(dayjs()) < 1) {
//     //   const data = onGetForcedToken();
//     //   token = typeof data === 'string' ? data : await data();
//     // }
//     // // setting updated token
//     // localStorage.setItem('authToken', token);
//     return config;
//   },
//   (err) => {
//     console.log("error in getting ", err);
//   }
// );

export default class BaseAPI {
  static config = async (): Promise<IConfig> => ({
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${await readAccessToken()}`,
    },
  });
  static async get(endpoint: string): Promise<AxiosResponse> {
    return axios.get(`${HOST}:${PORT}${endpoint}`, await this.config());
  }
  static async post(endpoint: string, body: any): Promise<AxiosResponse> {
    return axios.post(`${HOST}:${PORT}${endpoint}`, body, await this.config());
  }
}

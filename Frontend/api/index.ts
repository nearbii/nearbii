import axios, { AxiosResponse } from "axios";
import { readAccessToken } from "../clientUtils";

//change to your local ip
const HOST = process.env.HOST || "http://192.168.1.2";
const PORT = process.env.PORT || 5000;

interface IConfig {
  headers: { "content-type": string; Authorization: string };
}

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

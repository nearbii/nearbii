import axios, { AxiosResponse } from 'axios';


//change to your local ip
const HOST = process.env.HOST || "192.168.0.35";
const PORT = process.env.PORT || 5000;

interface IConfig {
    headers: {'content-type':string}
}

export default class BaseAPI {
    static config: IConfig = {
        headers: {
            'content-type':'application/json'
        }
    }
    static get(endpoint:string):Promise<AxiosResponse>{
        return axios.get(`${HOST}:${PORT}${endpoint}`, this.config);
    }
    static post(endpoint:string, body:any):Promise<AxiosResponse>{
        return axios.post(`${HOST}${PORT}${endpoint}`,body, this.config);
    }
}
import axios from 'axios';
import { config } from 'yargs';


//change to your local ip
const HOST = process.env.HOST || "192.168.0.35";
const PORT = process.env.PORT || 5000;

interface IConfig {
    headers: {'content-type':string}
}

export default class BaseAPI {
    config: IConfig
    constructor(){
        this.config = {
            headers: {
                'content-type':'application/json'
            }
        }
    }

    get(endpoint:string){
        return axios.get(`${HOST}:${PORT}${endpoint}`, this.config)
    }

    post(endpoint:string, body:any){
        return axios.post(`${HOST}${PORT}${endpoint}`,body, this.config);
    }
}
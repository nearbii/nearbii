const { apiRoutes } = require("../apiRoutes");
import { AxiosResponse } from 'axios';
import BaseApi from '.'

export default class AuthApi extends BaseApi {
  constructor(){
      super()
  }
  public static login(username:string, password:string):Promise<AxiosResponse> {
      const {login} = apiRoutes
      return this.post(login, {username, password});
  }
  public static register(username:string, password:string):Promise<AxiosResponse>{
    const {register} = apiRoutes;
    return this.post(register, {username,password});
  }
}


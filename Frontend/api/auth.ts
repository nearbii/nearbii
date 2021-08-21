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

// export function login(username: string, password: string) {
//   return fetch(`${HOST}:${PORT}${apiRoutes.login}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: username,
//       password: password,
//     }),
//   });
// }

// export function register(username: string, password: string) {
//   return fetch(`${HOST}:${PORT}${apiRoutes.register}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: username,
//       password: password,
//     }),
//   });
// }

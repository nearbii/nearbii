//Base
import { AxiosResponse } from "axios";
import BaseAPI from ".";

//App
const { apiRoutes } = require("../apiRoutes");

export default class PostApi extends BaseAPI {
  constructor(){
    super();
  }
  public static createPost(text:string):Promise<AxiosResponse>{
    const {post} = apiRoutes
    return this.post(post, {text: text})
  }
};

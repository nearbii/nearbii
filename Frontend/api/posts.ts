//Base
import { AxiosResponse } from "axios";
import BaseAPI from ".";

//App
const { apiRoutes } = require("../apiRoutes");

export default class PostApi extends BaseAPI {
  constructor() {
    super();
  }
  public static createPost(text: string): Promise<AxiosResponse> {
    const { post } = apiRoutes;
    return this.post(post, { text });
  }
  public static getPosts(): Promise<AxiosResponse> {
    const { getPosts } = apiRoutes;
    return this.get(getPosts);
  }
  public static votePostUp(postID: string): Promise<AxiosResponse> {
    const { votePostUp } = apiRoutes;
    return this.post(votePostUp, { postID });
  }
  public static votePostDown(postID: string): Promise<AxiosResponse> {
    const { votePostDown } = apiRoutes;
    return this.post(votePostDown, { postID });
  }
}

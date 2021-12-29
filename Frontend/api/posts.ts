//Base
import { AxiosResponse } from "axios";
import BaseAPI from ".";

//Location Info
import LocationAPI from "./location";
import { LocationObject } from "expo-location";

//App
const { apiRoutes } = require("../apiRoutes");

export default class PostApi extends BaseAPI {
  constructor() {
    super();
  }
  public static createPost(text: string): Promise<any> {
    const { post } = apiRoutes;
    return LocationAPI.getLocation()
      .then((location) => {
        this.post(post, { text, location });
      })
      .catch((e) => console.log(e));
  }
  public static getPosts(location: LocationObject): Promise<AxiosResponse> {
    const { getPosts } = apiRoutes;
    return this.post(getPosts, { location });
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

//Base
import { AxiosResponse } from "axios";
import BaseAPI from ".";

//Location Info
import * as Location from "expo-location";

//App
const { apiRoutes } = require("../apiRoutes");

async function getLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }
  return await Location.getCurrentPositionAsync({});
}

export default class PostApi extends BaseAPI {
  constructor() {
    super();
  }
  public static createPost(text: string): Promise<any> {
    const { post } = apiRoutes;
    return getLocation()
      .then((location) => {
        this.post(post, { text, location });
      })
      .catch((e) => console.log(e));
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

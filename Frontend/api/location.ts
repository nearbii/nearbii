//Base
import BaseAPI from ".";

//Location Info
import * as Location from "expo-location";
import { LocationObject } from "expo-location";

export default class LocationAPI extends BaseAPI {
  constructor() {
    super();
  }
  public static async getLocation(): Promise<LocationObject> {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }
    return Location.getCurrentPositionAsync({});
  }
}

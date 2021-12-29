//Location Info
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import StorageAPI from "./storage";

export default class LocationAPI {
  public static async getLocation(): Promise<LocationObject> {
    const locationRefreshFreq =
      process.env.LOCATIONREFRESHFREQ || 5 * 60 * 1000;

    if (
      new Date().getTime() -
        +(await StorageAPI.readValue("lastLocationUpdateTime")) <
      locationRefreshFreq
    ) {
      return JSON.parse(await StorageAPI.readValue("lastLocationUpdate"));
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    StorageAPI.storeKeyValue(
      "lastLocationUpdateTime",
      `${new Date().getTime()}`
    );
    const newLocation = await Location.getCurrentPositionAsync({});
    StorageAPI.storeKeyValue("lastLocationUpdate", JSON.stringify(newLocation));
    return newLocation;
  }
}

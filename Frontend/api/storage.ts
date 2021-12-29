import AsyncStorage from "@react-native-async-storage/async-storage";

export default class StorageAPI {
  public static async readValue(key: string): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
      throw new Error(`Couldn't find value for key '${key}'`);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public static async storeKeyValue(key: string, val: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      console.log(error);
    }
  }
}

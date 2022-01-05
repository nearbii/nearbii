import AsyncStorage from "@react-native-async-storage/async-storage";

export default class StorageAPI {
  public static async readValue(key: string): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
      console.error(`Couldn't find value for key '${key}'`);
      return "";
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public static async storeKeyValue(key: string, val: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      throw error;
    }
  }
}

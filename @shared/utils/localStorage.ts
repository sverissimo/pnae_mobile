import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: {}) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log("🚀 ~ file: localStorage.ts:8 ~ storeData ~ e:", e);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("🚀 ~ file: localStorage.ts:17 ~ getData ~ e:", e);
  }
};

export const removeValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log("🚀 ~ file: localStorage.ts:25 ~ removeValue ~ e:", e);
  }
};

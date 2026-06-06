import Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token: string) => {
  await Keychain.setGenericPassword('vanya_auth', token, {
    service: 'vanya_token_service'
  });
};

export const getToken = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: 'vanya_token_service'
  });
  return credentials ? credentials.password : null;
};

export const removeToken = async () => {
  await Keychain.resetGenericPassword({
    service: 'vanya_token_service'
  });
};

// Generic AsyncStorage helper
export const storage = {
  get: async (key: string) => {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  set: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('AsyncStorage error:', e);
    }
  },
  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('AsyncStorage error:', e);
    }
  }
};

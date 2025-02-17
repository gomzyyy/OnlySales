import {MMKV} from 'react-native-mmkv';
import {appinfo} from '../lib/appinfo';

const mmkvStorage = new MMKV({
  id: appinfo.appid,
  encryptionKey: 'khata',
});

const mmkv = {
  setItem: (key: string, value: string) => {
    mmkvStorage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = mmkvStorage.getString(key);
    return Promise.resolve(value || null);
  },
  removeItem: (key: string) => {
    mmkvStorage.delete(key);
    return Promise.resolve();
  },
};

export {mmkvStorage, mmkv};

import AsyncStorage from '@react-native-async-storage/async-storage';

const header = {
  r: {},
  cud: {'Content-Type': 'application/json'},
  media: {'Content-Type': 'multipart/form-data'},
};

const APIheaders = async (s: boolean, optType: 'r' | 'cud' | 'media') => {
  let token = null;
  if (s) {
    token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Secure API calls requires Access-Token!');
    }
    return {...header[optType], authorization: `Bearer ${token}`};
  } else {
    return header[optType];
  }
};

const FetchReq = async (
  route: string,
  method: string,
  reqType: 'r' | 'cud' | 'media',
  body?: any,
  secure: boolean = true,
) => {
  try {
    const headers = await APIheaders(secure, reqType);
    const baseUrl = 'http://192.168.1.71:6900/api/app';
    return fetch(baseUrl + route, {
      method,
      headers,
      body,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
};
export {FetchReq};

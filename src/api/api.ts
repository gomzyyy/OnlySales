import {AdminRole} from '../../enums';
import {
  LoginData,
  LoginReturnType,
  SignupData,
  APIReturnType,
} from './types.api';
import {SetStateAction} from 'react';
import { FetchReq } from './helper/fn';

export const validateTokenAPI = async (
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  if (setState) {
    setState(true);
  }
  try {
    const fetching = await FetchReq('/validate/token', 'POST', 'cud');
    return (await fetching.json()) as APIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {
        name: undefined,
      },
      success: false,
    } as {
      message: string;
      data: {name: string | undefined; role: AdminRole | undefined};
      success: boolean;
    };
  } finally {
    if (setState) {
      setState(false);
    }
  }
};

export const findUserAPI = async (
  data: {role: AdminRole; userId: string},
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  if (setState) {
    setState(true);
  }
  try {
    const {role, userId} = data;
    const fetching = await FetchReq(
      `/find/user?role=${role}&userId=${userId}`,
      'GET',
      'r',
    );
    const res = await fetching.json();
    return res as {
      message: string;
      data: {name: string | undefined; role: AdminRole | undefined};
      success: boolean;
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {
        name: undefined,
      },
      success: false,
    } as {
      message: string;
      data: {name: string | undefined; role: AdminRole | undefined};
      success: boolean;
    };
  } finally {
    if (setState) {
      setState(false);
    }
  }
};
export const signupAPI = async (
  data: SignupData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  if (setState) {
    setState(true);
  }
  try {
    const fetching = await FetchReq(
      '/signup',
      'POST',
      'cud',
      JSON.stringify(data),
    );
    const res = await fetching.json();
    return res;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      success: false,
    };
  } finally {
    if (setState) {
      setState(false);
    }
  }
};
export const loginAPI = async (
  data: LoginData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  if (setState) {
    setState(true);
  }
  try {
    const {role, userId, password} = data;
    const body = JSON.stringify({userId, password});
    const fetching = await FetchReq(
      `/login?role=${role}`,
      'POST',
      'cud',
      body,
    );
    const res = await fetching.json();
    return res as LoginReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: undefined,
      success: false,
    };
  } finally {
    if (setState) {
      setState(false);
    }
  }
};

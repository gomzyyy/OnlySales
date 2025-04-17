import {AdminRole} from '../../enums';
import {
  LoginData,
  LoginAPIReturnType,
  SignupData,
  SignupAPIReturnType,
  ValidateTokenData,
  ValidateTokenReturnType,
} from './types.api';
import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';

export const validateTokenAPI = async (
  data: ValidateTokenData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/validate/token?role=${data.role}`,
      method: 'POST',
    });

    return (await fetching.json()) as ValidateTokenReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {
        user: undefined,
      },
      success: false,
    } as ValidateTokenReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

export const findUserAPI = async (
  data: {role: AdminRole; userId: string},
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role, userId} = data;
    const fetching = await FetchAPI({
      route: `/find/user?role=${role}&userId=${userId}`,
      method: 'GET',
      reqType: 'r',
      secure: false,
    });
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
    handleBooleanState(setState, false);
  }
};
export const signupAPI = async (
  data: SignupData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    console.log(data);
    const body = JSON.stringify(data);
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: '/signup',
      secure: false,
      method: 'POST',
      body,
    });
    const res = await fetching.json();
    return res as SignupAPIReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: undefined,
      success: false,
    };
  } finally {
    handleBooleanState(setState, false);
  }
};
export const loginAPI = async (
  data: LoginData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role, userId, password} = data;
    const body = JSON.stringify({userId, password});
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/login?role=${role}`,
      secure: false,
      method: 'POST',
      body,
    });
    const res = await fetching.json();
    return res as LoginAPIReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: undefined,
      success: false,
    };
  } finally {
    handleBooleanState(setState, false);
  }
};

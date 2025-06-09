import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  GetUserAPIReturnType,
  GetUserAPIData,
  GetUserByIdAPIData,
  GetUserByIdAPIReturnType,
  UpdateUserPasscodeAPIData,
  UpdateUserPasscodeAPIReturnType,
  VerifyUserPasscodeAPIData,
  VerifyUserPasscodeAPIReturnType,
  UpdateAppLockStateAPIData,
  UpdateAppLockStateAPIReturnType,
} from './types.api';

export const getUserAPI = async (
  data: GetUserAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const fetching = await FetchAPI({
      reqType: 'r',
      route: `/get/user?role=${data.role}`,
      method: 'GET',
    });
    return (await fetching.json()) as GetUserAPIReturnType;
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
    } as GetUserAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

export const getUserByIdAPI = async (
  data: GetUserByIdAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role, userId, reqFor} = data.query;

    const fetching = await FetchAPI({
      reqType: 'r',
      method: 'GET',
      route: `/query/4/user?role=${role}&userId=${userId}&reqFor=${reqFor}`,
    });
    return (await fetching.json()) as GetUserByIdAPIReturnType;
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
    } as GetUserByIdAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
export const updatePasscodeAPI = async (
  data: UpdateUserPasscodeAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body);
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/user/passcode/update?role=${data.query.role}`,
      method: 'POST',
      body,
    });
    return (await fetching.json()) as UpdateUserPasscodeAPIReturnType;
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
    } as GetUserAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
export const updateAppLockStateAPI = async (
  data: UpdateAppLockStateAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body);
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/user/security/app-lock/update?role=${data.query.role}`,
      method: 'POST',
      body,
    });
    return (await fetching.json()) as UpdateAppLockStateAPIReturnType;
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
    } as GetUserAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
export const verifyPasscodeAPI = async (
  data: VerifyUserPasscodeAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body);
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/user/passcode/verify?role=${data.query.role}`,
      method: 'POST',
      body,
    });
    return (await fetching.json()) as VerifyUserPasscodeAPIReturnType;
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
    } as GetUserAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

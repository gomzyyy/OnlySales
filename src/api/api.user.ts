import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  GetUserAPIReturnType,
  GetUserAPIData,
  GetUserByIdAPIData,
  GetUserByIdAPIReturnType,
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

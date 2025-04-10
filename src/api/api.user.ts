import {SetStateAction} from 'react';
import {FetchAPI} from './helper/fn';
import {GetUserAPIReturnType,GetUserAPIData} from './types.api';

export const getUserAPI = async (
  data: GetUserAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  if (setState) {
    setState(true);
  }
  try {
    const fetching = await FetchAPI({
      reqType: 'r',
      route: `/get/user?role=${data.role}&uid`,
      method: 'GET',
    });
    return (await fetching.json()) as GetUserAPIReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: {
        user: undefined,
      },
      success: false,
    } as GetUserAPIReturnType;
  } finally {
    if (setState) {
      setState(false);
    }
  }
};

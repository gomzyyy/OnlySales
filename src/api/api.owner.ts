import {SetStateAction} from 'react';
import {FetchAPI} from './helper/fn';
import {GetOwnerAPIData, GetOwnerAPIReturnType} from './types.api';

export const getOwnerAPI = async (
  data: GetOwnerAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  if (setState) {
    setState(true);
  }
  try {
    const fetching = await FetchAPI({
      reqType: 'r',
      route: '/get/owner/info',
      method: 'GET',
      secure: false,
    });
    return (await fetching.json()) as GetOwnerAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {
        owner: undefined,
      },
      success: false,
    } as GetOwnerAPIReturnType;
  } finally {
    if (setState) {
      setState(false);
    }
  }
};

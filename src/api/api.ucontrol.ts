import {Dispatch, SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  UpdateUserLocationAPIData,
  UpdateUserLocationReturnType,
} from './types.api';

export const updateUserLocationAPI = async (
  data: UpdateUserLocationAPIData,
  setState?: Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body);
    const {role} = data.query;
    const res = await FetchAPI({
      reqType: 'cud',
      route: `/update/location?role=${role}`,
      method: 'POST',
      body,
    });
    return (await res.json()) as UpdateUserLocationReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Internal server error.',
      success: false,
    } as UpdateUserLocationReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

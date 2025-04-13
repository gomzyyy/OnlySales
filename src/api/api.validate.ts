import {SetStateAction} from 'react';
import {
  RequestOtpAPIData,
  RequestOtpAPReturnType,
  ValidateOtpAPIData,
  ValidateOtpAPReturnType,
} from './types.api';
import {FetchAPI, handleBooleanState} from './helper/fn';

export const requestEmailOtpAPI = async (
  data: RequestOtpAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body);
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/request/otp?role=${data.query.role}&uid=${data.query.uid}`,
      method: 'POST',
      body,
    });
    return (await fetching.json()) as RequestOtpAPReturnType;
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
    } as RequestOtpAPReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
export const ValidateEmailOtpAPI = async (
  data: ValidateOtpAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body);
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/validate/otp?role=${data.query.role}&uid=${data.query.uid}`,
      method: 'POST',
      body,
    });
    return (await fetching.json()) as ValidateOtpAPReturnType;
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
    } as ValidateOtpAPReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

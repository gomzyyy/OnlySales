import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  GetSinglePaymentHistoryAPIData,
  GetSinglePaymentHistoryAPIReturnType,
} from './types.api';

export const getSinglePaymentHistory = async (
  data: GetSinglePaymentHistoryAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role, paymentId, paymentType, createdBy, creatorId} = data.query;
    const fetching = await FetchAPI({
      reqType: 'r',
      route: `/get/history/single?role=${role}&paymentType=${paymentType}&paymentId=${paymentId}&createdBy=${createdBy}&creatorId=${creatorId}`,
      method: 'GET',
    });
    return (await fetching.json()) as GetSinglePaymentHistoryAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      success: false,
    } as GetSinglePaymentHistoryAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

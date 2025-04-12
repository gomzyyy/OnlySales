import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {SellProductAPIReturnType, SellProductData} from './types.api';

export const sellProductAPI = async (
  data: SellProductData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {buyerId, sellerId, role} = data.query;
    const body = JSON.stringify(data.body);
    const fetching = await FetchAPI({
      route: `/sell/product?buyerId=${buyerId}&sellerId=${sellerId}&role=${role}`,
      reqType: 'cud',
      method: 'POST',
      body,
    });
    return (await fetching.json()) as SellProductAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {
        soldProduct: undefined,
      },
      success: false,
    } as SellProductAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

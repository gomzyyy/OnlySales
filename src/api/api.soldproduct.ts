import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  DeleteProductData,
  DeleteSoldProductAPIReturnType,
  SellProductAPIReturnType,
  SellProductData,
} from './types.api';

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

export const deleteSoldProductAPI = async (
  data: DeleteProductData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {soldProductId, role} = data.query;
    const fetching = await FetchAPI({
      route: `/delete/sold-product?soldProductId=${soldProductId}&role=${role}`,
      reqType: 'cud',
      method: 'POST',
    });
    return (await fetching.json()) as DeleteSoldProductAPIReturnType;
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
    } as DeleteSoldProductAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

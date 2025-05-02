import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  DeleteSoldProductAPIReturnType,
  DeleteSoldProductData,
  SellProductAPIReturnType,
  SellProductData,
  UpdateSoldProductStateData,
  UpdateSoldProductStateReturnType,
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
  data: DeleteSoldProductData,
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

export const updateSoldProductStateAPI = async (
  data: UpdateSoldProductStateData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {soldProductId, role,updatedState} = data.query;
    const fetching = await FetchAPI({
      route: `/update/sold-product/state?soldProductId=${soldProductId}&role=${role}&updatedState=${updatedState}`,
      reqType: 'cud',
      method: 'POST',
    });
    return (await fetching.json()) as UpdateSoldProductStateReturnType;
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
    } as UpdateSoldProductStateReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

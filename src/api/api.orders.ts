import {
  GetOrdersByOwnerIdAPIData,
  GetOrdersByOwnerIdAPIReturnType,
  UpdateOrderStatusAPIData,
  UpdateOrderStatusAPIReturnType,
} from './types.api';
import {Dispatch, SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';

export const getOrdersByOwnerIdAPI = async (
  data: GetOrdersByOwnerIdAPIData,
  setState?: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    const {role, oid} = data.query;
    const fetching = await FetchAPI({
      route: `/get/orders?role=${role}&oid=${oid}`,
      reqType: 'r',
      method: 'GET',
    });
    return (await fetching.json()) as GetOrdersByOwnerIdAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {},
      success: false,
    } as GetOrdersByOwnerIdAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
export const updateOrderStatusAPI = async (
  data: UpdateOrderStatusAPIData,
  setState?: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    const {role, updatedStatus} = data.query;
    const body = JSON.stringify(data.body);
    const fetching = await FetchAPI({
      route: `/update/order/status?role=${role}&updatedStatus=${updatedStatus}`,
      reqType: 'cud',
      method: 'POST',
      body,
    });
    return (await fetching.json()) as UpdateOrderStatusAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {},
      success: false,
    } as UpdateOrderStatusAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

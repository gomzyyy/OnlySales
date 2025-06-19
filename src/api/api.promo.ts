import { GetPromoForCorouselAPIReturnType } from './types.api';
import {Dispatch, SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';

export const getPromoForCorousel = async (setState?: Dispatch<SetStateAction<boolean>>) => {
  try {
    const fetching = await FetchAPI({
      route: '/get/promo-content/4/corousel',
      reqType: 'r',
      method: 'GET',
    });
    return (await fetching.json()) as GetPromoForCorouselAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {},
      success: false,
    } as GetPromoForCorouselAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

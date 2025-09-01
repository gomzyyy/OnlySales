import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import { CreateServicePointAPIData, CreateServicePointAPIReturnType, GetAllServicePointsAPIData, GetAllServicePointsAPIReturnType, UpdateServicePointAPIData, UpdateServicePointAPIReturnType } from './types.api';


export const getAllServicePointsAPI = async (
  data: GetAllServicePointsAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const fetching = await FetchAPI({
      route: `/get/service-points/all?role=${data.query.role}&oid=${data.query.oid}`,
      reqType: 'r',
      method: 'GET',
    });

    return (await fetching.json()) as GetAllServicePointsAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {
        sps: undefined,
      },
      success: false,
    } as GetAllServicePointsAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

export const createServicePointAPI = async (
  data: CreateServicePointAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body)
    const fetching = await FetchAPI({
      route: `/create/service-point?role=${data.query.role}&oid=${data.query.oid}`,
      reqType: 'cud',
      method: 'POST',
      body
    });

    return (await fetching.json()) as CreateServicePointAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      success: false,
    } as CreateServicePointAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

export const updateServicePointAPI = async (
  data: UpdateServicePointAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const body = JSON.stringify(data.body)
    const fetching = await FetchAPI({
      route: `/update/user/service-point?role=${data.query.role}&oid=${data.query.oid}&spid=${data.query.spid}`,
      reqType: 'cud',
      method: 'PUT',
      body
    });

    return (await fetching.json()) as UpdateServicePointAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      success: false,
    } as UpdateServicePointAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
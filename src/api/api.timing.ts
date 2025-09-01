import {
  CreateBusinessTimingAPIData,
  CreateBusinessTimingAPIReturnType,
  DeleteBusinessTimingAPIData,
  DeleteBusinessTimingAPIReturnType,
} from './types.api';
import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';

export const createBusinessTimingAPI = async (
  data: CreateBusinessTimingAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {oid, role} = data.query;
    const fetching = await FetchAPI({
      route: `/business/timings/update?role=${role}&oid=${oid}`,
      reqType: 'cud',
      body: JSON.stringify(data.body),
      method: 'POST',
    });
    return (await fetching.json()) as CreateBusinessTimingAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Internal server error!',
      success: false,
    } as CreateBusinessTimingAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
export const deleteBusinessTimingAPI = async (
  data: DeleteBusinessTimingAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {oid, role, btid} = data.query;
    const fetching = await FetchAPI({
      route: `/delete/business_timing?role=${role}&oid=${oid}&btid=${btid}`,
      reqType: 'cud',
      method: 'DELETE',
    });
    return (await fetching.json()) as DeleteBusinessTimingAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Internal server error!',
      success: false,
    } as DeleteBusinessTimingAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

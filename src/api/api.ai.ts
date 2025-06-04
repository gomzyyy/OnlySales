import {AdminRole} from '../../enums';
import {
  AnalyseBusinessAIAPIData,
  AnalyseBusinessAPIReturnType,
  AnalyseSingleProductAIAPIData,
  AnalyseSingleProductAIReturnType,
} from './types.api';
import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';

export const analyseSingleProductAIAPI = async (
  data: AnalyseSingleProductAIAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role,oid,productId,rl} = data.query;
    console.log(data.query.rl)
    const fetching = await FetchAPI({
      reqType: 'r',
      route: `/ask-ai/4/analytics/product?role=${role}&oid=${oid}&productId=${productId}&rl=${rl}`,
      method: 'GET',
    });
    return (await fetching.json()) as AnalyseSingleProductAIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Internal server error!',
      success: false,
    } as AnalyseSingleProductAIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
export const analyseBusinessAIAPI = async (
  data: AnalyseBusinessAIAPIData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role,oid,rl} = data.query;
    const fetching = await FetchAPI({
      reqType: 'r',
      route: `/ask-ai/4/analytics/business?role=${role}&oid=${oid}&rl=${rl}`,
      method: 'GET',
    });
    return (await fetching.json()) as AnalyseBusinessAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Internal server error!',
      success: false,
    } as AnalyseBusinessAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

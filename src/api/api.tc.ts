import {Dispatch, SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  GetTermsAndConditionsAPIReturnType,
  GetPrivacyPolicyAPIReturnType,
  GetTermsAndPolicyAPIData
} from './types.api';

export const getTermsAndConditionsAPI = async (
  setState?: Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const fetching = await FetchAPI({
      route: `/terms-policy?r=tnc`,
      reqType: 'r',
      method: 'GET',
    });
    return (await fetching.json()) as GetTermsAndConditionsAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Internal server error.',
      success: false,
    } as GetTermsAndConditionsAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

export const getPrivacyPolicyAPI = async (
  setState?: Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const fetching = await FetchAPI({
      route: `/terms-policy?r=pp`,
      reqType: 'r',
      method: 'GET',
    });
    return (await fetching.json()) as GetPrivacyPolicyAPIReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Internal server error.',
      success: false,
    } as GetPrivacyPolicyAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

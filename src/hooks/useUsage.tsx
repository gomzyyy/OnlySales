import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {
  updateIntoCommon,
  UpdateIntoCommonProps,
  updateIntoUserSpecific,
  UpdateIntoPremiumProps,
  clearCommon,
  clearUserSpecific,
  clearAll,
} from '../../store/slices/usage';
export interface useUsageOptions {
  returnOnFail?: any;
}
export interface useUsageReturnType {
  get: (unique_name: string, opt?: useUsageOptions) => any;
  set: {
    common: (val: UpdateIntoCommonProps) => void;
    userspecific: (val: UpdateIntoPremiumProps) => void;
  };
  clear: {
    common: () => void;
    userspecific: () => void;
    all: () => void;
  };
}

const useUsage = (): useUsageReturnType => {
  const d = useDispatch<AppDispatch>();
  const {common, user_specific} = useSelector(
    (s: RootState) => s.usage.features,
  );
  const u = {...common, ...user_specific};
  const get = (unique_name: string, opt?: useUsageOptions) => {
    if (u[unique_name] === undefined) return opt?.returnOnFail;
    return u[unique_name];
  };

  const set = {
    common: (val: UpdateIntoCommonProps) => d(updateIntoCommon(val)),
    userspecific: (val: UpdateIntoPremiumProps) =>
      d(updateIntoUserSpecific(val)),
  };
  const clear = {
    common: () => d(clearCommon()),
    userspecific: () => d(clearUserSpecific()),
    all: () => d(clearAll()),
  };
  return {
    get,
    set,
    clear,
  };
};

export default useUsage;

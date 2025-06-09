import {View, Text} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  CreateCustomerAPIReturnType,
  createCustomerData,
  DeleteCustomerAPIReturnType,
  DeleteCustomerData,
  CreateEmployeeAPIData,
  CreateEmployeeReturnType,
  CreateProductAPIData,
  CreateProductAPIReturnType,
  SellProductData,
  SellProductAPIReturnType,
  DeleteEmployeeAPIData,
  DeleteEmployeeReturnType,
  UpdateCustomerData,
  UpdateCustomerAPIReturnType,
  DeleteProductAPIData,
  DeleteProductAPIReturnType,
  DeleteSoldProductData,
  DeleteSoldProductAPIReturnType,
  ValidateTokenReturnType,
  UpdateAppLockStateAPIReturnType,
  UpdateAppLockStateAPIData,
  UpdateUserPasscodeAPIData,
  UpdateUserPasscodeAPIReturnType,
  UpdateProductAPIData,
  UpdateProductAPIReturnType,
} from '../api/types.api';
import {
  createCustomerAPI,
  deleteCustomerAPI,
  updateCustomerAPI,
} from '../api/api.customer';
import {createEmployeeAPI, deleteEmployeeAPI} from '../api/api.employee';
import {
  createProductAPI,
  deleteProductAPI,
  updateProductAPI,
} from '../api/api.product';
import {deleteSoldProductAPI, sellProductAPI} from '../api/api.soldproduct';
import {validateTokenAPI} from '../api/api.auth';
import useAnalytics from './useAnalytics';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {setUser} from '../../store/slices/business';
import {showToast} from '../service/fn';
import {updateAppLockStateAPI, updatePasscodeAPI} from '../api/api.user';

export interface useStorageReturnType {
  customer: {
    create: (
      t: createCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<CreateCustomerAPIReturnType>;
    delete: (
      t: DeleteCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<DeleteCustomerAPIReturnType>;
    update: (
      t: UpdateCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<UpdateCustomerAPIReturnType>;
  };
  employee: {
    create: (
      t: CreateEmployeeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<CreateEmployeeReturnType>;
    delete: (
      t: DeleteEmployeeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<DeleteEmployeeReturnType>;
  };
  product: {
    create: (
      t: CreateProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<CreateProductAPIReturnType>;
    delete: (
      t: DeleteProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<DeleteProductAPIReturnType>;
     update: (
      t: UpdateProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<UpdateProductAPIReturnType>;
  };
  sellProduct: {
    create: (
      t: SellProductData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<SellProductAPIReturnType>;
    delete: (
      t: DeleteSoldProductData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<DeleteSoldProductAPIReturnType>;
  };
  user: {
    changeAppLockState: (
      data: UpdateAppLockStateAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<UpdateAppLockStateAPIReturnType>;
    updateAppPasscode: (
      data: UpdateUserPasscodeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<UpdateUserPasscodeAPIReturnType>;
  };
  local: {
    updateUser: (
      onErrorSettingLocalState?: () => void,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<ValidateTokenReturnType>;
  };
}
const useStorage = (): useStorageReturnType => {
  const d = useDispatch<AppDispatch>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const u = useSelector((s: RootState) => s.appData.user)!;
  useEffect(() => {
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected ?? false);
    };
    checkConnection();
  }, []);

  const updateLocalUserState = async (
    onErrorSettingLocalState?: () => void,
    setState?: Dispatch<SetStateAction<boolean>>,
  ) => {
    const res = await validateTokenAPI({role: u.role});
    if (res.success && res.data && res.data.user) {
      d(setUser(res.data.user));
    } else {
      onErrorSettingLocalState
        ? onErrorSettingLocalState()
        : showToast({
            type: 'info',
            text1: 'Error occured while syncing app.',
            text2:
              'Causes: 1). slow network 2). memory full 2). server issue. Fix: Restart the App.',
          });
    }
    return res as ValidateTokenReturnType;
  };
  const customer = {
    create: async (
      data: createCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await createCustomerAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
    update: async (
      data: UpdateCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await updateCustomerAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
    delete: async (
      data: DeleteCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await deleteCustomerAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
  };
  const product = {
    create: async (
      data: CreateProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await createProductAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
    delete: async (
      data: DeleteProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await deleteProductAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
    update: async (
      data: UpdateProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await updateProductAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
  };
  const sellProduct = {
    create: async (
      data: SellProductData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await sellProductAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
    delete: async (
      data: DeleteSoldProductData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await deleteSoldProductAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
  };
  const employee = {
    create: async (
      data: CreateEmployeeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await createEmployeeAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
    delete: async (
      data: DeleteEmployeeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await deleteEmployeeAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
  };
  const user = {
    changeAppLockState: async (
      data: UpdateAppLockStateAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const r = await updateAppLockStateAPI(data, setState);
      if (r.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return r;
    },
    updateAppPasscode: async (
      data: UpdateUserPasscodeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const res = await updatePasscodeAPI(data, setState);
      if (res.success) {
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return res;
    },
  };
  return {
    customer,
    product,
    sellProduct,
    employee,
    user,
    local: {
      updateUser: updateLocalUserState,
    },
  };
};

export default useStorage;

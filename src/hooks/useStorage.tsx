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
} from '../api/types.api';
import {
  createCustomerAPI,
  deleteCustomerAPI,
  updateCustomerAPI,
} from '../api/api.customer';
import {createEmployeeAPI, deleteEmployeeAPI} from '../api/api.employee';
import {createProductAPI, deleteProductAPI} from '../api/api.product';
import {deleteSoldProductAPI, sellProductAPI} from '../api/api.soldproduct';
import {validateTokenAPI} from '../api/api.auth';
import useAnalytics from './useAnalytics';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {setUser} from '../../store/slices/business';
import {showToast} from '../service/fn';

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
  local: {
    updateUser: (onErrorSettingLocalState?: () => void) => Promise<void>;
  };
}
const useStorage = (): useStorageReturnType => {
  const d = useDispatch<AppDispatch>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const user = useSelector((s: RootState) => s.appData.user)!;
  useEffect(() => {
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected ?? false);
    };
    checkConnection();
  }, []);

  const updateLocalUserState = async (
    onErrorSettingLocalState?: () => void,
  ) => {
    const res = await validateTokenAPI({role: user.role});
    console.log(res);
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

  return {
    customer,
    product,
    sellProduct,
    employee,
    local: {
      updateUser: updateLocalUserState,
    },
  };
};

export default useStorage;

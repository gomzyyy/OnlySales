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
  GetEventsAPIData,
  GetEventsAPIReturnType,
  GetOrdersByOwnerIdAPIData,
  GetOrdersByOwnerIdAPIReturnType,
  CreateServicePointAPIData,
  UpdateServicePointAPIData,
  CreateServicePointAPIReturnType,
  UpdateServicePointAPIReturnType,
  GetAllServicePointsAPIData,
  GetAllServicePointsAPIReturnType,
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
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {handleEvents, handleOrders} from '../../store/slices/events';
import {setUser} from '../../store/slices/business';
import {showToast} from '../service/fn';
import {
  getEventsAPI,
  updateAppLockStateAPI,
  updatePasscodeAPI,
} from '../api/api.user';
import {handleBooleanState} from '../api/helper/fn';
import {getOrdersByOwnerIdAPI} from '../api/api.orders';
import {
  createServicePointAPI,
  getAllServicePointsAPI,
  updateServicePointAPI,
} from '../api/api.servicePoint';
import {addServicePoint, setPoints} from '../../store/slices/servicePoint';
import {COMMON_ERR_MSG_OBJ} from '../utils/Constants';

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
    getEvents: (
      data: GetEventsAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<GetEventsAPIReturnType>;
    getOrders: (
      data: GetOrdersByOwnerIdAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<GetOrdersByOwnerIdAPIReturnType>;
    createServicePoint: (
      data: CreateServicePointAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => Promise<CreateServicePointAPIReturnType>;
    updateServicePoint: (
      data: UpdateServicePointAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<UpdateServicePointAPIReturnType>;
    getAllServicePoints: (
      data: GetAllServicePointsAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<GetAllServicePointsAPIReturnType>;
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
    handleBooleanState(setState, true);
    const res = await validateTokenAPI({role: u.role});
    if (res.success && res.data && res.data.user) {
      d(setUser(res.data.user));
    } else {
      onErrorSettingLocalState
        ? onErrorSettingLocalState()
        : showToast(COMMON_ERR_MSG_OBJ['err_app_sync']);
    }
    handleBooleanState(setState, false);
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
    getEvents: async (
      data: GetEventsAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const res = await getEventsAPI(data, setState);
      if (res.success && res.data && res.data.events) {
        d(handleEvents(res.data.events));
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return res;
    },
    getOrders: async (
      data: GetOrdersByOwnerIdAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const res = await getOrdersByOwnerIdAPI(data, setState);
      if (res.success && res.data && res.data.orders) {
        d(handleOrders(res.data.orders));
        await updateLocalUserState(onErrorSettingLocalState);
      }
      return res;
    },
    createServicePoint: async (
      data: any,
      setState?: Dispatch<SetStateAction<boolean>>,
      onErrorSettingLocalState?: () => void,
    ) => {
      const res = await createServicePointAPI(data, setState);
      if (res.success && res.data && res.data.servicePoint) {
        d(addServicePoint(res.data.servicePoint));
      } else {
        onErrorSettingLocalState && onErrorSettingLocalState();
      }
      return res;
    },
    updateServicePoint: async (
      data: UpdateServicePointAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => {
      const res = await updateServicePointAPI(data, setState);
      return res;
    },
    getAllServicePoints: async (
      data: GetAllServicePointsAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => {
      const res = await getAllServicePointsAPI(data, setState);
      if (res.success && res.data && res.data.sps) {
        d(setPoints(res.data.sps));
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

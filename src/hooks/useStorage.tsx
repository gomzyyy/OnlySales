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
import { createCustomerAPI, deleteCustomerAPI, updateCustomerAPI } from '../api/api.customer';
import { createEmployeeAPI, deleteEmployeeAPI } from '../api/api.employee';
import { createProductAPI, deleteProductAPI } from '../api/api.product';
import { deleteSoldProductAPI, sellProductAPI } from '../api/api.soldproduct';

export interface useStorageReturnType {
  customer: {
    create: (
      t: createCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<CreateCustomerAPIReturnType>;
    delete: (
      t: DeleteCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<DeleteCustomerAPIReturnType>;
    update: (
      t: UpdateCustomerData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<UpdateCustomerAPIReturnType>;
  };
  employee: {
    create: (
      t: CreateEmployeeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<CreateEmployeeReturnType>;
    delete: (
      t: DeleteEmployeeAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<DeleteEmployeeReturnType>;
  };
  product: {
    create: (
      t: CreateProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<CreateProductAPIReturnType>;
    delete: (
      t: DeleteProductAPIData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<DeleteProductAPIReturnType>;
  };
  sellProduct: {
    create: (
      t: SellProductData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<SellProductAPIReturnType>;
    delete: (
      t: DeleteSoldProductData,
      setState?: Dispatch<SetStateAction<boolean>>,
    ) => Promise<DeleteSoldProductAPIReturnType>;
  };
}
const useStorage= ():useStorageReturnType => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  useEffect(() => {
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected ?? false);
    };
    checkConnection();
  }, []);

  return {
    customer:{
        create:createCustomerAPI,
        update:updateCustomerAPI,
        delete:deleteCustomerAPI
    },
    product:{
        create:createProductAPI,
        delete:deleteProductAPI
    },
    sellProduct:{
        create:sellProductAPI,
        delete:deleteSoldProductAPI
    },
    employee:{
        delete:deleteEmployeeAPI,
        create:createEmployeeAPI
    }
  };
};

export default useStorage;

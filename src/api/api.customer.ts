import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {
  CreateCustomerAPIReturnType,
  createCustomerData,
  DeleteCustomerAPIReturnType,
  DeleteCustomerData,
  UpdateCustomerAPIReturnType,
  UpdateCustomerData,
} from './types.api';

export const createCustomerAPI = async (
  data: createCustomerData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role, createdBy, creatorId} = data.query;
    const formData = new FormData();
    formData.append('name', data.body.name);
    formData.append('businessOwnerId', data.body.businessOwnerId);
    if (data.body.address) formData.append('address', data.body.address);
    if (data.body.phoneNumber)
      formData.append('phoneNumber', data.body.phoneNumber);
    if (data.body.email) formData.append('email', data.body.email);
    if (data.media?.image) {
      const imageFile = {
        uri: data.media.image,
        type: 'image/jpeg',
        name: 'customer_profile.jpg',
      };
      formData.append('img', imageFile as any);
    }
    const fetching = await FetchAPI({
      reqType: 'media',
      route: `/create/customer?role=${role}&createdBy=${createdBy}&creatorId=${creatorId}`,
      method: 'POST',
      body: formData,
    });
    return (await fetching.json()) as CreateCustomerAPIReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: {
        customer: undefined,
      },
      success: false,
    } as CreateCustomerAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

export const deleteCustomerAPI = async (
  data: DeleteCustomerData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role, customerId} = data.query;
    const fetching = await FetchAPI({
      reqType: 'cud',
      route: `/delete/customer?role=${role}&customerId=${customerId}`,
      method: 'DELETE',
    });
    return (await fetching.json()) as DeleteCustomerAPIReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: {
        customer: undefined,
      },
      success: false,
    } as CreateCustomerAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

export const updateCustomerAPI = async (
  data: UpdateCustomerData,
  setState?: React.Dispatch<SetStateAction<boolean>>,
) => {
  handleBooleanState(setState, true);
  try {
    const {role, customerId, ownerId} = data.query;

    const formData = new FormData();
    if (data.body.name) formData.append('name', data.body.name);
    if (data.body.address) formData.append('address', data.body.address);
    if (data.body.phoneNumber)
      formData.append('phoneNumber', data.body.phoneNumber);
    if (data.body.email) formData.append('email', data.body.email);
    if (data.media?.image) {
      const imageFile = {
        uri: data.media.image,
        type: 'image/jpeg',
        name: 'profile.jpg',
      };
      formData.append('img', imageFile as any);
    }

    const fetching = await FetchAPI({
      reqType: 'media',
      route: `/update/customer?role=${role}&customerId=${customerId}&ownerId=${ownerId}`,
      method: 'PUT',
      body: formData
    });
    return (await fetching.json()) as UpdateCustomerAPIReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: {
        customer: undefined,
      },
      success: false,
    } as CreateCustomerAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

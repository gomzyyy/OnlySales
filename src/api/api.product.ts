import {SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';
import {CreateProductAPIData, CreateProductAPIReturnType} from './types.api';

export const createProductAPI = async (
  data: CreateProductAPIData,
  setState: React.Dispatch<SetStateAction<boolean>>,
) => {
    handleBooleanState(setState, true);
  try {
    const formData = new FormData();
    formData.append('creatorId', data.query.creatorId);
    formData.append('role', data.query.role);
    formData.append('ownerId', data.query.ownerId);
    formData.append('name', data.body.name);
    formData.append('basePrice', data.body.basePrice.toString());
    formData.append('quantity', data.body.quantity.toString());
    formData.append('measurementType', data.body.measurementType);
    formData.append('stock', data.body.stock.toString());
    formData.append('productCost', data.body.productCost.toString());
    formData.append('productType', data.body.productType);

    if (data.body.measurementTypeDescription) {
      formData.append(
        'measurementTypeDescription',
        data.body.measurementTypeDescription,
      );
    }
    if (data.media.image) {
      formData.append('image', {
        uri: data.media.image,
        type: 'image/jpeg',
        name: 'product.jpg',
      } as any);
    }

    const fetching = await FetchAPI({
      route: `/create/product`,
      reqType: 'media',
      method: 'POST',
      body: formData,
    });

    return (await fetching.json()) as CreateProductAPIReturnType;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      data: {
        customer: undefined,
      },
      success: false,
    } as CreateProductAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

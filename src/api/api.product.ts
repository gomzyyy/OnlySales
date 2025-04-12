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
      formData.append('img', {
        uri: data.media.image,
        type: 'image/jpeg',
        name: 'product.jpg',
      } as any);
    }

    const fetching = await FetchAPI({
      route: `/create/product?role=${data.query.role}&creatorId=${data.query.creatorId}&ownerId=${data.query.ownerId}`,
      reqType: 'media',
      method: 'POST',
      body: formData,
    });

    return (await fetching.json()) as CreateProductAPIReturnType;
  } catch (error) {
    return {
      message: error instanceof Error
      ? error.message
      : 'Internal server Error occured while fetching',
      data: {
        product: undefined,
      },
      success: false,
    } as CreateProductAPIReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};

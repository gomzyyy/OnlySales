import {AdminRole, MeasurementType, ProductType} from '../../enums';
import {Customer, Employee, Owner, Partner} from '../../types';

export interface APIReturnType {
  message: string;
  success: boolean;
}

export interface ValidateTokenData {
  role: AdminRole;
}

export interface ValidateTokenReturnType extends APIReturnType {
  data: {
    user: Owner | Partner | Employee | undefined;
  };
}

export interface LoginAPIReturnType extends APIReturnType {
  data: {
    token: string;
    user: Owner | Partner | Employee;
  };
}
export interface SignupAPIReturnType extends APIReturnType {
  data: {
    user: Owner;
  };
}

export interface SignupData {
  name: string;
  phoneNumber: string;
  password: string;
  email: string;
  address: string;
  ownerId: string;
  businessAddress: string;
  businessNake: string;
  businessPhoneNumber: string;
  businessDescription: string;
  businessType: string;
  role: AdminRole;
}
export interface LoginData {
  password: string;
  userId: string;
  role: AdminRole;
}
export interface createCustomerData {
  query: {
    role: AdminRole;
    creatorId: string;
    createdBy: AdminRole;
  };
  body: {
    name: string;
    address?: string;
    businessOwnerId: Owner['_id'];
    phoneNumber?: string;
    email?: string;
  };
  media?: {
    image?: string;
  };
}
export interface CreateCustomerAPIReturnType extends APIReturnType {
  data: {
    customer: Customer | undefined;
  };
}
export interface GetOwnerAPIReturnType extends APIReturnType {
  data: {
    owner: Owner | undefined;
  };
}
export interface GetOwnerAPIData {
  role: AdminRole;
  ownerId: string;
}
export interface GetUserAPIReturnType extends APIReturnType {
  data: {
    user: Owner | Employee | Partner | undefined;
  };
}
export interface GetUserAPIData {
  role: AdminRole;
}

export interface CreateProductAPIData {
  query: {
    creatorId: string;
    role: AdminRole;
    ownerId: string;
  };
  body: {
    name: string;
    basePrice: number;
    quantity: number;
    measurementType: MeasurementType;
    stock: number;
    productCost: number;
    productType: ProductType;
    measurementTypeDescription?: string;
  };
  media: {
    image?: string;
  };
}

export interface CreateProductAPIReturnType extends APIReturnType {}

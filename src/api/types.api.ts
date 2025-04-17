import {
  AdminRole,
  BusinessType,
  MeasurementType,
  PaymentHistoryReferenceType,
  ProductType,
} from '../../enums';
import {
  Customer,
  Employee,
  Owner,
  Partner,
  Product,
  SoldProduct,
  SoldProductPaymentHistory,
  UnknownPaymentHistory,
} from '../../types';

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
    token: string;
  };
}

export interface SignupData {
  name: string; // //
  phoneNumber?: string;
  password: string; //
  email: string; //
  address?: string;
  userId: string; // //
  businessAddress: string; // //
  businessName: string; // //
  businessPhoneNumber: string; // //
  businessDescription?: string; //
  businessType: BusinessType; // //
  role: AdminRole; //
  gstNumber?: string;
  uniqueReferralCode?: string;
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

export interface DeleteCustomerData {
  query: {
    customerId: string;
    role: AdminRole;
  };
}

export interface DeleteCustomerAPIReturnType extends APIReturnType {}

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

export interface CreateProductAPIReturnType extends APIReturnType {
  data: {
    product: Product | undefined;
  };
}

export interface DeleteProductAPIData {
  query: {
    productId: string;
    role: AdminRole;
    uid: string;
  };
}

export interface DeleteProductAPIReturnType extends APIReturnType {}

export interface SellProductData {
  query: {
    buyerId: string;
    sellerId: string;
    role: AdminRole;
  };
  body: {
    productId: string;
    count: number;
  };
}

export interface SellProductAPIReturnType extends APIReturnType {
  data: {
    soldProduct: SoldProduct | undefined;
    seller: Owner | Partner | Employee | undefined;
  };
}

export interface RequestOtpAPIData {
  query: {
    uid: string;
    role: AdminRole;
  };
  body: {
    updatedEmail?: string;
  };
}
export interface RequestOtpAPReturnType extends APIReturnType {}

export interface ValidateOtpAPIData {
  query: {role: string; uid: string};
  body: {
    otp: string;
  };
}

export interface ValidateOtpAPReturnType extends APIReturnType {}

export interface ValidateReferralCodeAPReturnType extends APIReturnType {}
export interface ValidateReferralCodeAPIData {
  query: {
    referralCode: string;
  };
}
export interface GetSinglePaymentHistoryAPIData {
  query: {
    role: AdminRole;
    paymentType: PaymentHistoryReferenceType;
    paymentId: string;
    creatorId: string;
    createdBy: AdminRole;
  };
}
export interface GetSinglePaymentHistoryAPIReturnType extends APIReturnType {
  data: {
    paymentDetails:
      | SoldProductPaymentHistory
      | UnknownPaymentHistory
      | undefined;
  };
}

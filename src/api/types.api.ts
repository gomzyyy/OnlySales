import {
  AdminRole,
  AIResponseLengthType,
  BusinessType,
  MeasurementType,
  OrderStatus,
  PaymentHistoryReferenceType,
  PaymentState,
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
  User,
  TermsAndConditions,
  PrivacyPolicy,
  CommonProps,
  Event,
  Order,
  PromoCorouselContext,
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
  query: {};
  body: {
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
  };
  media: {
    image: string | undefined;
  };
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

export interface UpdateCustomerData {
  query: {
    customerId: string;
    role: AdminRole;
    ownerId: string;
  };
  body: {
    name?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
  };
  media: {
    image?: string;
  };
}

export interface UpdateCustomerAPIReturnType extends APIReturnType {}

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
    discountedPrice?: number;
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

export interface UpdateProductAPIData {
  query: {
    productId: string;
    role: AdminRole;
    oid: string;
  };
  body: {
    name?: string;
    basePrice?: number;
    quantity?: number;
    measurementType?: MeasurementType;
    stock?: number;
    productCost?: number;
    productType?: ProductType;
    measurementTypeDescription?: string;
    discountedPrice?: number;
  };
  media: {
    image?: string;
  };
}

export interface UpdateProductAPIReturnType extends APIReturnType {}

export interface SellProductData {
  query: {
    buyerId: string;
    sellerId: string;
    role: AdminRole;
    orderStatus?: OrderStatus;
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

export interface DeleteSoldProductData {
  query: {
    soldProductId: string;
    role: AdminRole;
  };
}

export interface DeleteSoldProductAPIReturnType extends APIReturnType {}

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

export interface CreateEmployeeAPIData {
  query: {
    creatorId: string;
    createdBy: AdminRole;
    role: AdminRole;
  };
  body: {
    name: string;
    userId: string;
    phoneNumber?: string;
    password: string;
    position: string;
    positionDescription?: string;
    email: string;
    address?: string;
    gender: string;
    department: string;
    departmentDescription?: string;
    salary: number;
    status: string;
    statusDescription?: string;
    skills?: string[]; // assuming it's an array of skills
    shift: string;
    shiftDescription?: string;
    reportsToModel?: string;
    businessOwnerId: string;
    hrUid?: string;
  };
  media: {
    image?: string;
  };
}

export interface CreateEmployeeReturnType extends APIReturnType {}

export interface DeleteEmployeeAPIData {
  query: {
    employeeId: string;
    role: AdminRole;
  };
}

export interface DeleteEmployeeReturnType extends APIReturnType {}

export interface UpdateUserLocationAPIData {
  query: {
    role: AdminRole;
  };
  body: {
    periodicLatitude?: number;
    periodicLongitude?: number;
    liveLatitude?: number;
    liveLongitude?: number;
  };
}

export interface UpdateUserLocationReturnType extends APIReturnType {}

export interface GetUserByIdAPIData {
  query: {
    role: AdminRole;
    userId: string;
    reqFor: AdminRole;
  };
}

export interface GetUserByIdAPIReturnType extends APIReturnType {
  data: {
    user: Owner | Employee | Partner | undefined;
    userType: AdminRole | undefined;
  };
}

export interface UpdateSoldProductStateData {
  query: {role: AdminRole; updatedState: PaymentState};
  body: {
    soldProducts: SoldProduct[];
  };
}
export interface UpdateSoldProductStateReturnType extends APIReturnType {}

export interface UploadPdfToCloudAPIData {
  query: {
    role: AdminRole;
  };
  media: {
    pdf: string;
  };
}

export interface UploadPdfToCloudReturnType extends APIReturnType {
  data: {
    url?: string;
  };
}

export interface AnalyseSingleProductAIAPIData {
  query: {
    role: AdminRole;
    oid: User['_id'];
    productId: Product['_id'];
    rl: AIResponseLengthType;
  };
}
export interface AnalyseSingleProductAIReturnType extends APIReturnType {
  data: {
    response?: string;
  };
}
export interface AnalyseBusinessAIAPIData {
  query: {
    role: AdminRole;
    oid: User['_id'];
    rl: AIResponseLengthType;
  };
}
export interface AnalyseBusinessAPIReturnType extends APIReturnType {
  data: {
    response?: string;
  };
}
export interface GetTermsAndPolicyAPIData {
  query: {
    r: 'tnc' | 'pp';
  };
}
export interface GetTermsAndConditionsAPIReturnType extends APIReturnType {
  data: {
    tnc?: TermsAndConditions;
  };
}
export interface GetPrivacyPolicyAPIReturnType extends APIReturnType {
  data: {
    pp?: PrivacyPolicy;
  };
}
export interface UpdateUserPasscodeAPIData {
  query: {
    role: AdminRole;
  };
  body: {
    newPasscode: string;
    currPasscode?: string;
  };
}
export interface UpdateUserPasscodeAPIReturnType extends APIReturnType {}
export interface UpdateAppLockStateAPIData {
  query: {
    role: AdminRole;
  };
  body: {
    state: 1 | 0;
  };
}
export interface UpdateAppLockStateAPIReturnType extends APIReturnType {}
export interface VerifyUserPasscodeAPIData {
  query: {
    role: AdminRole;
  };
  body: {
    passcode: string;
  };
}
export interface VerifyUserPasscodeAPIReturnType extends APIReturnType {}

export interface GetEventsAPIData {
  query: {
    role: AdminRole;
    oid: CommonProps['_id'];
  };
}
export interface GetEventsAPIReturnType extends APIReturnType {
  data: {
    events?: Event[];
  };
}
export interface GetOrdersByOwnerIdAPIData {
  query: {
    role: AdminRole;
    oid: CommonProps['_id'];
  };
}
export interface GetOrdersByOwnerIdAPIReturnType extends APIReturnType {
  data: {
    orders?: Order[];
  };
}
export interface UpdateOrderStatusAPIData {
  query: {
    role: AdminRole;
    updatedStatus: OrderStatus;
  };
  body: {
    order: Order['_id'];
  };
}
export interface UpdateOrderStatusAPIReturnType extends APIReturnType {}
export interface GetPromoForCorouselAPIReturnType extends APIReturnType {
data:{
  context?:PromoCorouselContext
}
}
import {AdminRole, BusinessType, QuantityType, AppThemeName} from './enums';

export interface AppTheme {
  name: AppThemeName;
  baseColor: string;
  fadeColor: string;
  tabColor: string;
  borderColor: string;
  textColor: string;
  contrastColor: string;
  bgColor: string;
}

export interface App {
  serchResults: Customer[];
  currency: string;
  currentTheme: AppThemeName;
}

export interface Shopkeeper {
  id: string;
  name: string;
  role: AdminRole;
  image?: string | undefined;
  businessType: BusinessType;
  menu: Product[];
  starProducts?: Product[];
  customers: Customer[];
  sessionPasscode: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
export interface Product {
  id: string;
  name: string;
  image?: string | undefined;
  totalSold: number;
  basePrice: string;
  discountedPrice?: string;
  quantity: string;
  measurementType: QuantityType;
  createdAt: Date;
  updatedAt: Date;
}
export interface Customer {
  id: string;
  fullName: string;
  phoneNumber?: string;
  image?: string | undefined;
  address?: string;
  shopkeeperId: string;
  unpaidPayments?: Product[];
  paidPayments?: Product[];
  createdAt: Date;
  updatedAt?: Date;
}


import { BusinessType, QuantityType } from "./enums";

export interface App{
  serchResults:Customer[]
}

export interface Shopkeeper {
  id: string;
  name: string;
  image?: string | null;
  businessType: BusinessType;
  shelf: Product[];
  starProducts?: Product[];
  customers: Customer[];
  // *sessionPasscode,
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  image?: string | null;
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
  image?: string | null;
  unpaidPayments: Product[];
  paidPayments: Product[];
  createdAt: Date;
  updatedAt: Date;
}

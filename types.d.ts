import {
  AdminRole,
  BusinessType,
  QuantityType,
  AppThemeName,
  AssetCategory,
  EmploymentStatus,
  Shift,
} from './enums';

export interface AppTheme {
  name: AppThemeName;
  baseColor: string;
  fadeColor: string;
  tabColor: string;
  borderColor: string;
  textColor: string;
  contrastColor: string;
  bgColor: string;
  textAlt: string;
  modal: ModalTheme;
  toggleBtn: ToogleBtnTheme;
  tab: TabTheme;
  header: HeaderTheme;
}

export interface HeaderTheme {
  textColor: string;
}

export interface ModalTheme {
  title: string;
  inputbg: string;
  inputBorder: string;
  inputText: string;
  pickerbg: string;
  pickerText: string;
  saveBtnbg: string;
  saveBtnText: string;
}

export interface ToogleBtnTheme {
  bgActive: string;
  bgInactive: string;
  textActive: string;
  textInactive: string;
}
export interface TabTheme {
  label: string;
  bg: string;
  value: string;
  btnBg: string;
  btnText: string;
  icon: string;
  text: string;
}
export interface App {
  searchResults: {
    customerResults: Customer[];
    employeeResults: Employee[];
  };
  currency: string;
  currentTheme: AppTheme | undefined;
  defaultTheme: AppTheme;
  previousOwners: BusinessOwner[];
  deviceId?: string | undefined;
  appLocked: boolean;
}

export interface User {
  id: string;
  name: string;
  phoneNumber?: string;
  image?: string | undefined;
  createdAt: string;
  updatedAt: string;
  address?: string;
}

export interface Customer extends User {
  businessOwnerId: string;
  unpaidPayments?: SoldProduct[];
  paidPayments?: SoldProduct[];
  createdAt: string;
  updatedAt?: string;
}

export interface BusinessOwner extends User {
  businessAddress?: string;
  businessPartners?: BusinessOwner[];
  businessName?: string;
  businessDescription?: string;
  businessType?: BusinessType;
  EmployeeData: Employee[];
  inventory: Product[];
  starProducts?: Product[];
  customers: Customer[];
  role: AdminRole;
  sessionId: number | null;
  accessPasscode?: [string, string, string, string] | undefined;
  userId: string;
}

export interface Employee extends User {
  businessOwnerId: string;
  department?: string; // Department name (e.g., IT, HR, Sales)
  position?: string; // Job title or role
  email?: string; // Work email
  hireDate: string; // Date of joining
  salary: number; // Salary details
  status: EmploymentStatus; // Employment status
  address?: string; // Employee's address
  skills?: string[]; // List of employee skills
  shift: Shift; // Work shift
  reportsTo?: string; // Manager ID or name
}

export interface Product {
  id: string;
  name: string;
  image?: string | undefined;
  totalSold: number;
  basePrice: number;
  discountedPrice?: number;
  quantity: number;
  measurementType: QuantityType;
  stock?: number;
  productCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SoldProduct extends Product {
  addedAt: number;
  count: number;
}
export interface Asset {
  id: string;
  name: string;
  type: string;
  category: AssetCategory;
  value: number;
  acquiredDate: string;
  description?: string;
  documentUrl?: string;
}

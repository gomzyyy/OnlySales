import {
  AdminRole,
  BusinessType,
  QuantityType,
  AppThemeName,
  AssetCategory,
  EmploymentStatus,
  Shift,
  CurrencyType,
  AssetType,
  LibilityType,
  LibilityStatus,
  AssetStatus,
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
  bottomTabBg: string;
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
  currency: CurrencyType;
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
  email?: string;
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
  assets: Asset[];
  liabilities: Liability[];
  inventory: Product[];
  starProducts?: Product[];
  customers: Customer[];
  role: AdminRole;
  sessionId: number | null;
  accessPasscode?: [string, string, string, string] | undefined;
  userId: string;
}

export interface Employee extends User {
  businessOwner: string | BusinessOwner;
  gender: string;
  department?: string; // Department name (e.g., IT, HR, Sales)
  position?: string; // Job title or role
  email?: string; // Work email
  hireDate: string; // Date of joining
  salary: number; // Salary details
  status: EmploymentStatus; // Employment status
  statusDescription?: string;
  address?: string; // Employee's address
  skills?: string[]; // List of employee skills
  shift: Shift; // Work shift
  shiftDescription?: string;
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
  measurementTypeDescription?: string;
  stock?: number;
  productCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SoldProduct extends Product {
  buyer: string;
  addedAt: number;
  count: number;
}

export interface Asset {
  id: string; // Unique identifier
  name: string; // Name of the asset
  tangible: boolean; // Type of asset (e.g., tangible, intangible)
  category: AssetCategory; // Main category of the asset
  categoryDescription?: string; // Description of the category
  value: number; // Estimated value of the asset
  acquiredDate: string; // Date when the asset was acquired
  description?: string; // Additional details about the asset
  documentUrl?: string; // URL to supporting documents or proof of ownership
  assetType: AssetType;
  appreciatingRate?: number;
  depreciationRate?: number; // Annual depreciation rate (if applicable)
  currentValue?: number; // Estimated current value after depreciation
  location?: string; // Physical location of the asset
  warrantyExpiryDate?: string; // Warranty or guarantee expiration date
  status?: AssetStatus; // Asset status
  lastMaintenanceDate?: string; // Last maintenance check (for equipment or machines)
  nextMaintenanceDate?: string; // Next scheduled maintenance (if applicable)
  ownerId?: string; // Reference to the business owner
}

export interface Liability {
  id: string; // Unique identifier for the liability
  name: string; // Name of the liability
  type: LibilityType; // Type of liability
  category: string; // Category of liability
  categoryDescription?: string; // Description of the category
  amount: number; // Original amount of the liability
  interestRate?: number; // Interest rate (if applicable)
  startDate: string; // Start date of the liability
  dueDate: string; // Maturity or due date for payment
  installmentAmount?: number; // Fixed installment amount (if applicable)
  remainingBalance?: number; // Outstanding amount to be paid
  status?: LibilityStatus; // Status of the liability
  ownerId?: string; // Reference to the business owner
}

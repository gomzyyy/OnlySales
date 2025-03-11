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
  textAlt: string;
  modal: ModalTheme;
  toggleBtn: ToogleBtnTheme;
  tab: TabTheme;
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
}
export interface App {
  searchResults: Customer[];
  currency: string;
  currentTheme: AppTheme | undefined;
  defaultTheme: AppTheme;
  previousShopkeepers: Shopkeeper[];
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
  shopkeeperId: string;
  unpaidPayments?: newSoldProduct[];
  paidPayments?: newSoldProduct[];
  createdAt: string;
  updatedAt?: string;
}

export interface Shopkeeper extends User {
  businessAddress?:string;
  businessName?: string;
  businessType?: BusinessType;
  inventory: Product[];
  starProducts?: Product[];
  customers: Customer[];
  role: AdminRole;
  sessionId: number | null;
  accessPasscode?: [string, string, string, string] | undefined;
  userId: string;
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

export interface newSoldProduct extends Product {
  addedAt: string;
  count: number;
}

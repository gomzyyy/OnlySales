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
  userId: string;
  phoneNumber?: string;
  sessionId: number | null;
  role: AdminRole;
  image?: string | undefined;
  accessPasscode?: [string, string, string, string] | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface Shopkeeper extends User {
  businessType: BusinessType;
  menu: Product[];
  starProducts?: Product[];
  customers: Customer[];
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
  createdAt: string;
  updatedAt: string;
}
export interface Customer {
  id: string;
  fullName: string;
  phoneNumber?: string;
  image?: string | undefined;
  address?: string;
  shopkeeperId: string;
  unpaidPayments?: newUdharProduct[];
  paidPayments?: newUdharProduct[];
  createdAt: string;
  updatedAt?: string;
}

export interface newUdharProduct extends Product {
  addedAt: string;
  count: number;
}

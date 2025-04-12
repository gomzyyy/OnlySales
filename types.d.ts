import {
  AdminRole,
  BusinessType,
  AppThemeName,
  AssetCategory,
  EmploymentStatus,
  Shift,
  CurrencyType,
  AssetType,
  LibilityType,
  LibilityStatus,
  AssetStatus,
  Department,
  Position,
  ProductType,
  MeasurementType,
  PaymentState,
  PaymentHistoryReferenceType,
  UnknownPaymentType,
  AccountTypeEnum,
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
  previousOwners: Owner[] | Partner[] | Employee[];
  deviceId?: string | undefined;
  appLocked: boolean;
}

export interface CommonProps {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends CommonProps {
  name: string;
  phoneNumber?: {
    value: string;
    verified: boolean;
  };
  image?: string | undefined;
  email?: {
    value: string;
    verified: boolean;
  };
  address?: string;
  userId: string;
}

export interface Customer extends User {
  businessOwner: Owner;
  buyedProducts: SoldProduct[];
  createdBy: Owner | Partner | Employee;
  createdByModel: AdminRole;
}

export interface AccountType extends CommonProps {
  type: AccountTypeEnum;
  connectedWith: Owner | Employee | Partner | string;
  connectedWithType: AdminRole;
  expiresAt?: Date;
  initialisedAt?: Date;
  renewalCount: number;
}

export interface OwnerProperties {
  searchable: boolean;
  isDisabled: boolean;
  accessBusinessInfo: boolean;
  isPrivate: boolean;
  partnerSearchable: boolean;
  employeeSearchable: boolean;
}

export interface Owner extends User {
  password: string;
  otp: OTP | undefined;
  businessAddress: string;
  equity: number;
  businessName: string;
  businessPhoneNumber: number;
  businessPartners: Partner[];
  gstNumber: string;
  accountType: AccountType;
  history: History;
  properties: OwnerProperties;
  businessDescription?: string;
  businessType: BusinessType;
  employeeData: Employee[];
  inventory: Product[];
  customers: Customer[];
  role: AdminRole;
  assets: Asset[];
  liabilities: Liability[];
  accessPasscode: [string, string, string, string] | undefined;
}

export interface OTP {
  otp: string;
  expiredAt: Date;
  generatedAt: Date;
}

export interface CRUDPermissions {
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface UserPermissions {
  customer: CRUDPermissions;
  employee: CRUDPermissions;
  product: CRUDPermissions;
  soldProduct: CRUDPermissions;
  docs: CRUDPermissions;
  analytics: {
    accessable: boolean;
  };
}

export interface Partner extends User {
  businessOwner: Owner;
  password: string;
  equity: number;
  role: AdminRole;
  accessPasscode: [string, string, string, string];
  permissions: UserPermissions;
}

export interface Employee extends User {
  businessOwner: Owner;
  gender: string;
  password: string;
  department: Department;
  departmentDescription?: string;
  position: Position;
  positionDescription?: string;
  hireDate: Date;
  salary: number;
  status: EmploymentStatus;
  statusDescription?: string;
  skills: string[];
  role: AdminRole;
  shift: Shift;
  shiftDescription?: string;
  reportsTo: Owner | Employee | Partner;
  reportsToModel: AdminRole;
  permissions: UserPermissions;
  createdBy: Owner | Partner | Employee;
  createdByModel: AdminRole;
}

export interface Product extends CommonProps {
  name: string;
  businessOwner: Owner;
  productType: ProductType;
  image?: string;
  totalSold: number;
  basePrice: number;
  discounterPrice?: number;
  quantity: number;
  measurementType: MeasurementType;
  measurementTypeDescription?: string;
  stock: number;
  productCost: number;
  createdBy: Owner | Partner | Employee;
  createdByModel: AdminRole;
}

export interface SoldProduct extends CommonProps {
  product: Product;
  buyer: string;
  state: PaymentState;
  count: number;
  soldBy: Owner | Employee | Partner | string;
  soldByModel: AdminRole;
}

export interface Asset extends CommonProps {
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

export interface Liability extends CommonProps {
  name: string; // Name of the liability
  type: LibilityType; // Type of liability
  category: string; // Category of liability
  categoryDescription?: string; // Description of the category
  amount: number; // Original amount of the liability
  interestRate?: number; // Interest rate (if applicable)
  documentUrl?: string;
  startDate: string; // Start date of the liability
  dueDate: string; // Maturity or due date for payment
  installmentAmount?: number; // Fixed installment amount (if applicable)
  remainingBalance?: number; // Outstanding amount to be paid
  status?: LibilityStatus; // Status of the liability
  ownerId?: string; // Reference to the business owner
}
export interface SoldProductPaymentHistory extends CommonProps {
  referenceType: PaymentHistoryReferenceType;
  reference: SoldProduct | string;
  info: {
    name: string;
    amount: number;
  };
  paymentDescription: string;
  state: PaymentState;
  disabled: boolean;
}
export interface UserDetail {
  name?: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
}
export interface ItemDetail {
  name1?: string;
  price?: number;
  quantity?: number;
}
export interface UnknownPaymentHistory extends CommonProps {
  type: UnknownPaymentType;
  paymentDescription: string;
  details: {
    to: UserDetails;
    from: UserDetails;
  };
  payments: {
    items: ItemDetail;
  };
  state: PaymentState;
}
export interface PaymentHistory {
  payment: string;
  paymentType: PaymentHistoryReferenceType;
  createdAt: Date;
  createdBy: Owner | Partner | Employee | string;
  createdByModel: AdminRole;
}
export interface History {
  payments: PaymentHistory[];
}

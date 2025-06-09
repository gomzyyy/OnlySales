import {
  AdminRole,
  BusinessType,
  AppThemeName,
  AssetCategory,
  EmploymentStatus,
  Shift,
  CurrencyType,
  AssetType,
  LiabilityType,
  LiabilityStatus,
  AssetStatus,
  Department,
  Position,
  ProductType,
  MeasurementType,
  PaymentState,
  PaymentHistoryReferenceType,
  UnknownPaymentType,
  AccountTypeEnum,
  LocationRef,
  ReviewRefType,
  UserRefType,
  ReviewerType,
  EventHistoryReference,
  EventReference,
  EventStatus,
  SUPPORT_THREAD_PRIORITY,
  SUPPORT_THREAD_STATUS,
  SUPPORT_THREAD_CATEGORY,
} from './enums';

declare global {
  var __turboModuleProxy: any | undefined;
}

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
  lc_meta_data: {
    upi_id: {
      valid: boolean;
      id: string;
    };
    visible_name?: string;
    visible_message?: string;
  };
}

export interface CommonProps {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Review extends CommonProps {
  reviewRef: string;
  reviewRefType: ReviewRefType;
  userRef: string;
  userRefType: UserRefType;
  reviewer: string;
  reviewerType: ReviewerType;
  rating: number;
  feedback: string;
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
  accessPasscode: string;
  isLocked: boolean;
  location: Location;
}

export interface Location extends CommonProps {
  userId: string;
  locationRef: LocationRef;
  type: {
    live: {
      longitude: number;
      latitude: number;
    };
    periodic: {
      longitude: number;
      latitude: number;
    };
  };
}

export interface Customer extends CommonProps {
  name: string;
  phoneNumber?: string;
  image?: string | undefined;
  email?: {
    value: string;
    verified: boolean;
  };
  address?: string;
  userId: string;
  location: Location;
  businessOwner: Owner;
  buyedProducts: SoldProduct[];
  createdBy: Owner | Partner | Employee;
  createdByModel: AdminRole;
}

export interface AccountType extends CommonProps {
  type: AccountTypeEnum;
  connectedWith: Owner | Employee | Partner;
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
  notificationSettings:{
    email:boolean;
    sms:boolean;
    inApp:boolean;
  };
  isDeleted:{
    ok:boolean;
    deletedAt:Date;
  };
  loginInfo:{
    lastLogin:Date;
    loginAttempts:number
  }
}

export interface Document{
  name:string;
  url:string;
  uploadedAt:Date;
  verified:boolean
}

export interface ISupportTicket extends CommonProps {
  owner: Owner['_id'];
  subject: string;
  message: string;
  status: SUPPORT_THREAD_STATUS;
  priority: SUPPORT_THREAD_PRIORITY;
  category: SUPPORT_THREAD_CATEGORY;
  attachments: {
    filename: string;
    url: string;
    uploadedAt: Date;
  }[];
  adminResponses: {
    message: string;
    respondedBy: CommonProps['_id'];
    respondedAt?: Date;
  }[];
  resolvedAt?: Date;
}


export interface Owner extends User {
  referralCode: string;
  credits: number;
  reviews: Review[];
  recommendations: Customer[];
  password: string;
  otp: OTP | undefined;
  businessAddress: string;
  equity: number;
  businessName: string;
  businessPhoneNumber: {
    value: string;
    verified: boolean;
  };
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
  documentAcceptance:{
    terms:{
      accepted:boolean;
      acceptedAt:Date;
      version:string
    };
     privacyPolicy:{
      accepted:boolean;
      acceptedAt:Date;
      version:string
    };
  };
documents:Document[];
supportThreads:ISupportTicket[];
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
  disabled: boolean;
  totalSold: number;
  reviews: Review;
  basePrice: number;
  discountedPrice?: number;
  quantity: number;
  measurementType: MeasurementType;
  measurementTypeDescription?: string;
  stock?: number;
  productCost: number;
  createdBy: Owner | Partner | Employee;
  createdByModel: AdminRole;
}

export interface SoldProduct extends CommonProps {
  product: Product;
  buyer: Customer;
  state: PaymentState;
  disabled: boolean;
  count: number;
  soldBy: Owner | Employee | Partner;
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
  type: LiabilityType; // Type of liability
  category: string; // Category of liability
  categoryDescription?: string; // Description of the category
  amount: number; // Original amount of the liability
  interestRate?: number; // Interest rate (if applicable)
  documentUrl?: string;
  startDate: string; // Start date of the liability
  dueDate: string; // Maturity or due date for payment
  installmentAmount?: number; // Fixed installment amount (if applicable)
  remainingBalance?: number; // Outstanding amount to be paid
  status?: LiabilityStatus; // Status of the liability
  ownerId?: string; // Reference to the business owner
}
export interface SoldProductPaymentHistory extends CommonProps {
  referenceType: PaymentHistoryReferenceType;
  reference: SoldProduct;
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
export interface PaymentHistory extends CommonProps {
  payment: string;
  paymentType: PaymentHistoryReferenceType;
  createdAt: Date;
  createdBy: string;
  createdByModel: AdminRole;
  title: string;
  amount: number;
  shortNote: string;
  type: UnknownPaymentType;
}
export interface Event extends CommonProps {
  title: string;
  description: string;
  refType: EventHistoryReference;
  reference: Owner | Partner | Employee | Customer | CommonProps['_id'];
  refDescription?: string;
  eventRef?:
    | Owner
    | Partner
    | Employee
    | Customer
    | SoldProduct
    | Product
    | Asset
    | Liability
    | Review
    | CommonProps['_id'];
  eventRefType?: EventReference;
  files: string[];
  thumbnail?: string;
  metaData: CommonProps['_id'];
  status: EventStatus;
  locatedAt: string | Location;
}
export interface History {
  payments: PaymentHistory[];
  events: Event[];
}

interface LegalDocument {
  version: string | number;
  documentType: string;
  title: string;
  dateIssued: string;
  effectiveDate: string;
  requiresUserAcceptance: boolean;
  summary?: string;
  url?: string;
}
interface TermPrivacySection {
  title: string;
  content: TermPrivacyPoint[];
}

interface TermPrivacyPoint {
  point?: string;
  description: string;
}
interface TermsAndConditions extends LegalDocument {
  tnc: TermPrivacySection[];
}
interface PrivacyPolicy extends LegalDocument {
  pp: TermPrivacySection[];
}

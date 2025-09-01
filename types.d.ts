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
  OrderStatus,
  AcceptedByType,
  PaymentMethods,
  ValidRoles,
  ServicePointStatus,
  MediaType,
  FileLabel,
  AddressLocaitonType,
  WeekDays,
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
  SID: number;
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
  SID: number;
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
      updatedAt: Date;
      geo: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
      };
    };
    periodic: {
      longitude: number;
      latitude: number;
      updatedAt: Date;
      geo: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
      };
    };
  };
}

export interface Customer extends CommonProps {
  SID: number;
  name: string;
  phoneNumber?: string;
  image?: string | undefined;
  email?: {
    value: string;
    verified: boolean;
  };
  address?: string;
  userId: string;
  orders: string[];
  role: ValidRoles;
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
  isOpenToday: boolean;
  isDisabled: boolean;
  accessBusinessInfo: boolean;
  isPrivate: boolean;
  partnerSearchable: boolean;
  employeeSearchable: boolean;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  isDeleted: {
    ok: boolean;
    deletedAt: Date;
  };
  loginInfo: {
    lastLogin: Date;
    loginAttempts: number;
  };
  business: {
    currencyType: string;
  };
  doscoverability: {
    categories: string[];
    tags: string[];
    keywords: string[];
  };
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

export interface ServicePoint extends CommonProps {
  SID: number;
  ownerId: Owner['_id'];
  pointName: string;
  qrUrl: string;
  isActive: boolean;
  orderLimitPerDay: number;
  status: ServicePointStatus;
  lastOrderAt: Date;
  isOccupied: boolean;
  qrScanCount: number;
  metadata?: Record<string, string>;
}

export interface Address extends CommonProps {
  uid: CommonProps['_id'];
  ref: ValidRoles;
  displayAreaName: string;
  completeAddress: string;
  location: {
    type: 'Point';
    coordinates: number[];
  };
  localityName?: string;
  landmark?: string;
  pincode?: string;
  city: string;
  state: string;
  country: string;
  isPrimary: boolean;
}

export interface BusinessTiming extends CommonProps {
  oid: Owner['_id'];
  day: WeekDays;
  slots: {open: string; close: string}[];
  isClosed: boolean;
}
export interface HolidaySlot extends CommonProps {
  oid: Owner['_id'];
  date: Date;
  from: string;
  to: string;
  fullDay: boolean;
  reason: string;
}

export interface Owner extends User {
  userId: string;
  referralCode: string;
  fiscal: {
    yearEndMonth: number;
    yearEndDay: number;
    lastSheetFor: number;
  };
  credits: number;
  businessTiming: BusinessTiming[];
  holidaySlots: HolidaySlot[];
  reviews: Review[];
  recommendations: Customer[];
  password: string;
  otp: OTP | undefined;
  businessAddresses: Address[];
  equity: number;
  businessName: string;
  businessPhoneNumber: {
    value: string;
    verified: boolean;
  };
  servicePoints: string[];
  businessPartners: Partner[];
  legalDocuments: File[];
  gstNumber?: File;
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
  documentAcceptance: {
    terms: {
      accepted: boolean;
      acceptedAt: Date;
      version: string;
    };
    privacyPolicy: {
      accepted: boolean;
      acceptedAt: Date;
      version: string;
    };
  };
  documents: File[];
  supportThreads: ISupportTicket[];
}

export interface File extends CommonProps {
  url: string;
  refId: CommonProps['_id'];
  refModel: ValidRoles;
  mediaType: MediaType;
  label: FileLabel;
  fileId?: string;
  shortNote?: string;
  description?: string;
  verified: boolean;
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
  userId: string;
  businessOwner: Owner;
  password: string;
  equity: number;
  role: AdminRole;
  permissions: UserPermissions;
}

export interface Employee extends User {
  businessOwner: Owner;
  gender: string;
  userId?: string;
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
  SID: number;
  name: string;
  businessOwner: string;
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
  productCost: number;
  createdBy: Owner | Partner | Employee;
  createdByModel: AdminRole;
  inStock: boolean;
}

// Delivery Info Interface
export interface DeliveryInfo {
  shortAddress?: string;
  suggestions?: string;
  shortNote?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

// Order Interface
export interface Order extends CommonProps {
  SID: number;
  ownerId: CommonProps['_id'];
  orderedBy: Customer;
  products: {product: Product; count: number}[];
  totalAmount: number;
  acceptedByType?: AcceptedByType;
  acceptedBy?: Owner | Partner | Employee;
  isDeleted: boolean;
  orderedAt?: Date;
  orderStatus?: OrderStatus;
  acceptedAt?: Date;
  deliveredAt?: Date;
  deliveryInfo?: DeliveryInfo;
  paymentMethod?: PaymentMethods;
  maxLife: number;
  expiresAt?: Date;
}

export interface SoldProduct extends CommonProps {
  SID: number;
  product: Product;
  buyer: Customer;
  state: PaymentState;
  disabled: boolean;
  count: number;
  orderStatus: OrderStatus;
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
  owner: Owner['_id'];
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
  locatedAt?: {long: number; lat: number};
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

export interface SlideItem {
  media: string;
  mediaType: 'IMAGE' | 'VIDEO';
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  rel: {
    promoType: 'self' | 'third_party';
    relWithFeature: string;
  };
}

export interface PromoCorouselContext {
  sponsorName: string;
  sponsorLogo: string;
  sponsorTagline: string;
  campaignId: string;
  context: SlideItem[];
}
export interface NoteMedia {
  url: string;
  type: 'image' | 'video' | 'audio' | 'mixed';
  alt?: string;
}
export interface Note {
  _id: User['_id'];
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  media: NoteMedia[];
  hashtags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  color?: string;
  isArchived: boolean;
  isDeleted: boolean;
  isDraft: boolean;
  deletedAt?: Date;
  sharedWith: string[];
}

export enum PLATFORM_SPECIFIED_CALLS {
  MOBILE = 'mobileapp',
  WEB_APP = 'webapp',
  WEBSITE = 'website',
}
export enum BusinessType {
  RETAIL = 'Retail',
  WHOLESALE = 'Wholesale',
  MANUFACTURING = 'Manufacturing',
  SERVICE = 'Service',
  DISTRIBUTION = 'Distribution',
  OTHER = 'Other',
}
export enum CurrencyType {
  INR = '₹',
}
export enum MeasurementType {
  SUBSCRIPTION = 'Subscription',
  SERVICE = 'Service',
  ML = 'Ml',
  LITRE = 'Litre',
  KILOGRAM = 'Kilogram',
  GRAMS = 'Grams',
  PCS = 'Pcs',
  PACK = 'Pack',
  DOZEN = 'Dozen',
  METER = 'Meter',
  CENTIMETER = 'Centimeter',
  INCH = 'Inch',
  FOOT = 'Foot',
  SQUARE_METER = 'Square Meter',
  CUBIC_METER = 'Cubic Meter',
  BOX = 'Box',
  GALLON = 'Gallon',
  OUNCE = 'Ounce',
  POUND = 'Pound',
  OTHER = 'Other',
}
export enum AdminRole {
  OWNER = 'Owner',
  PARTNER = 'Partner',
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin',
}
export enum ValidRoles {
  OWNER = 'Owner',
  PARNER = 'Partner',
  EMPLOYEE = 'Employee',
  CUSTOMER = 'Customer',
}
export enum LocationRef {
  OWNER = 'Owner',
  PARTNER = 'Partner',
  EMPLOYEE = 'Employee',
  CUSTOMER = 'Customer',
}

export enum AppThemeName {
  RED = 'Blood Moon',
  GREEN = 'Cyber Lime',
  BLUE = 'Deep Ocean',
  // CORAL = 'Salmon Mist',
}

export enum AssetCategory {
  CASH = 'Cash',
  INVESTMENT = 'Investment',
  PROPERTY = 'Property',
  VEHICLE = 'Vehicle',
  STOCKS = 'Stocks',
  BONDS = 'Bonds',
  PATENTS = 'Patents',
  OTHER = 'Other', //need to fix and add more categories
}

export enum EmploymentStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  TERMINATED = 'Terminated',
  RESIGNATION = 'Resignation',
  OTHER = 'Other',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  RATHER_NOT_TO_SAY = 'Rather not to say',
  OTHER = 'Other',
}

export enum Shift {
  MORNING = 'Morning',
  EVENING = 'Evening',
  NIGHT = 'Night',
  UNDECIDED = 'Undecided',
  OTHER = 'Other',
}

export enum AssetType {
  DEPRECIATING = 'Depreciating',
  APPRECIATING = 'Appreciating',
}

export enum AssetStatus {
  ACTIVE = 'Active',
  DISPOSED = 'Disposed',
  UNDER_MAINTENANCE = 'Under-Maintenance',
}

export enum LiabilityType {
  CURRENT = 'Current',
  NON_CURRENT = 'Non-Current',
  CONTINGENT = 'Contingent',
}
export enum LiabilityStatus {
  ACTIVE = 'Active',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
}

export enum Department {
  SALES = 'Sales',
  IT = 'IT',
  HR = 'HR',
  FINANCE = 'Finance',
  OPERATIONS = 'Operations',
  ADMIN = 'Admin',
  CUSTOMER_SUPPORT = 'Customer Support',
  LEGAL = 'Legal',
  PROCUREMENT = 'Procurement',
  LOGISTICS = 'Logistics',
  RESEARCH_AND_DEVELOPMENT = 'Research and Development',
  QUALITY_ASSURANCE = 'Quality Assurance',
  TRAINING = 'Training',
  MARKETING = 'Marketing',
  PUBLIC_RELATIONS = 'Public Relations',
  DESIGN = 'Design',
  SECURITY = 'Security',
  COMPLIANCE = 'Compliance',
  ENGINEERING = 'Engineering',
  BUSINESS_DEVELOPMENT = 'Business Development',
  MAINTENANCE = 'Maintenance',
  OTHER = 'Other',
}

export enum Position {
  SALES_EXECUTIVE = 'Sales Executive',
  CEO = 'CEO',
  CTO = 'CTO',
  CFO = 'CFO',
  COO = 'COO',
  CMO = 'CMO',
  HR_MANAGER = 'HR Manager',
  SOFTWARE_ENGINEER = 'Software Engineer',
  DATA_ANALYST = 'Data Analyst',
  PRODUCT_MANAGER = 'Product Manager',
  MARKETING_EXECUTIVE = 'Marketing Executive',
  CUSTOMER_SUPPORT_SPECIALIST = 'Customer Support Specialist',
  ADMINISTRATIVE_ASSISTANT = 'Administrative Assistant',
  ACCOUNTANT = 'Accountant',
  OPERATIONS_MANAGER = 'Operations Manager',
  LEGAL_ADVISOR = 'Legal Advisor',
  PROCUREMENT_OFFICER = 'Procurement Officer',
  UX_UI_DESIGNER = 'UX/UI Designer',
  QUALITY_ANALYST = 'Quality Analyst',
  BUSINESS_ANALYST = 'Business Analyst',
  PROJECT_MANAGER = 'Project Manager',
  NETWORK_ADMINISTRATOR = 'Network Administrator',
  SECURITY_OFFICER = 'Security Officer',
  RESEARCH_SCIENTIST = 'Research Scientist',
  CONTENT_WRITER = 'Content Writer',
  GRAPHIC_DESIGNER = 'Graphic Designer',
  PUBLIC_RELATIONS_MANAGER = 'Public Relations Manager',
  TRAINING_SPECIALIST = 'Training Specialist',
  MAINTENANCE_ENGINEER = 'Maintenance Engineer',
  OTHER = 'Other',
}
export enum ProductType {
  PHYSICAL = 'Physical',
  DIGITAL = 'Digital',
  SUBSCRIPTION = 'Subscription',
  SERVICE = 'Service',
}
export enum PaymentState {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
}
export enum PaymentHistoryReferenceType {
  SOLD_PRODUCT = 'SoldProductPaymentHistory',
  UNKNOWN = 'UnknownPaymentHistory',
}
export enum UnknownPaymentType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}
export enum AccountTypeEnum {
  REGULAR = 'Regular',
  PREMIUM = 'Premium',
  ON_TRIAL = 'OnTrial',
}
export enum ReviewRefType {
  PRODUCT = 'Product',
  OWNER = 'Owner',
}
export enum UserRefType {
  OWNER = 'Owner',
}
export enum ReviewerType {
  CUSTOMER = 'Customer',
}
export enum NATIVE_WEBVIEW_MESSAGE_TYPE {
  OWNER_PROFILE_UPDATE_SUCCESS = 'OWNER_PROFILE_UPDATE_SUCCESS',
  OWNER_PROFILE_UPDATE_FAILED = 'OWNER_PROFILE_UPDATE_FAILED',
}
export enum AIResponseLengthType {
  vsm = 'vsm',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xlg = 'xlg',
}
export enum EventHistoryReference {
  OWNER = 'Owner',
  PARNER = 'Partner',
  EMPLOYEE = 'Employee',
  CUSTOMER = 'Customer',
}
export enum EventReference {
  OWNER = 'Owner',
  PARNER = 'Partner',
  EMPLOYEE = 'Employee',
  CUSTOMER = 'Customer',
  SoldProduct = 'SoldProduct',
  Product = 'Product',
  Asset = 'Asset',
  Liability = 'Liability',
  Review = 'Review',
}
export enum EventStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
export enum LegalDocType {
  tnc = 'TERMS_AND_CONDITIONS',
  pp = 'PRIVACY_POLICY',
}
export enum SUPPORT_THREAD_STATUS {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum SUPPORT_THREAD_PRIORITY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum SUPPORT_THREAD_CATEGORY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}
export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  WAITING = 'WAITING',
}

export enum PaymentMethods {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
  NETBANKING = 'NETBANKING',
  WALLET = 'WALLET',
  // Add more as needed
}

export enum AcceptedByType {
  OWNER = 'owner',
  PARTNER = 'partner',
  EMPLOYEE = 'employee',
}

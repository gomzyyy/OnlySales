export enum BusinessType {
  RETAIL = 'Retail',
  WHOLESALE = 'Wholesale',
  MANUFACTURING = 'Manufacturing',
  SERVICE = 'Service',
  DISTRIBUTION = 'Distribution',
  OTHER = 'Other',
}
export enum CurrencyType {
  INR = 'INR',
}
export enum MeasurementType {
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
}

export enum LocationRef {
  OWNER = 'Owner',
  PARTNER = 'Partner',
  EMPLOYEE = 'Employee',
  CUSTOMER = 'Customer',
}

export enum AppThemeName {
  // PURPLE = 'Midnight Orchid',
  RED = 'Blood Moon',
  // YELLOW = 'Molten Gold',
  GREEN = 'Cyber Lime',
  BLUE = 'Deep Ocean',
  // CORAL = 'Salmon Mist',
}

export enum AssetCategory {
  CASH = 'Cash',
  INVESTMENT = 'Investment',
  PROPERTY = 'Property',
  VECHILE = 'Vehicle',
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
  evening = 'Evening',
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

export enum LibilityType {
  CURRENT = 'Current',
  NON_CURRENT = 'Non-Current',
  CONTINGENT = 'Contingent',
}
export enum LibilityStatus {
  ACTIVE = 'Active',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
}

export enum Department {
  IT = 'IT',
  HR = 'HR',
  SALES = 'Sales',
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
  CEO = 'CEO',
  CTO = 'CTO',
  CFO = 'CFO',
  COO = 'COO',
  CMO = 'CMO',
  HR_MANAGER = 'HR Manager',
  SOFTWARE_ENGINEER = 'Software Engineer',
  DATA_ANALYST = 'Data Analyst',
  PRODUCT_MANAGER = 'Product Manager',
  SALES_EXECUTIVE = 'Sales Executive',
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

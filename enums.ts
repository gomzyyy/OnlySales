export enum BusinessType {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  MANUFACTURING = 'manufacturing',
  SERVICE = 'service',
  DISTRIBUTION = 'distribution',
  OTHER = 'other',
}
export enum CurrencyType {
  INR = 'INR',
}
export enum QuantityType {
  ML = 'Ml',
  LITRE = 'Litre',
  KILOGRAMS = 'Kilograms',
  GRAMS = 'Grams',
  PCS = 'Pcs',
  PACK = 'Pack',
  DOZENS = 'Dozen',
  OTHER = 'Other',
}
export enum AdminRole {
  OWNER = 'Owner',
  PARTNER = 'Partner',
  EMPLOYEE = 'Employee',
}
export enum AppThemeName {
  PURPLE = 'Midnight Orchid',
  RED = 'Blood Moon',
  YELLOW = 'Molten Gold',
  GREEN = 'Cyber Lime',
  BLUE = 'Deep Ocean',
  CORAL = 'Salmon Mist',
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

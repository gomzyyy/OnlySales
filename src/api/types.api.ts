import {AdminRole} from '../../enums';
import {Employee, Owner, Partner} from '../../types';

export interface APIReturnType {
  message: string;
  success: boolean;
}
export interface LoginReturnType extends APIReturnType {
  data: {
    token: string;
    user: Owner | Partner | Employee;
  };
}

export interface SignupData {
  name: string;
  phoneNumber: string;
  password: string;
  email: string;
  address: string;
  ownerId: string;
  businessAddress: string;
  businessNake: string;
  businessPhoneNumber: string;
  businessDescription: string;
  businessType: string;
  role: AdminRole;
}
export interface LoginData {
  password: string;
  userId: string;
  role: AdminRole;
}

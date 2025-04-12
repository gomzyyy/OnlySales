import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  Owner,
  App,
  Customer,
  Product,
  SoldProduct,
  AppTheme,
  Employee,
  User,
  Partner,
} from '../../types';
import {
  AdminRole,
  BusinessType,
  CurrencyType,
  EmploymentStatus,
  Shift,
} from '../../enums';
import 'react-native-get-random-values';
import {Theme} from '../../src/utils/Constants';
import {checkDate, randomId, showToast} from '../../src/service/fn';

type appstate = {
  user: Owner | Partner | Employee | undefined;
  app: App;
};

const initialState: appstate = {
  user: undefined,
  app: {
    currency: CurrencyType.INR,
    searchResults: {
      customerResults: [],
      employeeResults: [],
    },
    currentTheme: undefined,
    defaultTheme: Theme[4],
    previousOwners: [],
    deviceId: undefined,
    appLocked: false,
  },
};

const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Owner | Partner | Employee>) => {
      const {payload} = action;
      state.user = payload;
    },
    deleteUser: state => {
      state.user = undefined;
    },
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      const choosedTheme: AppTheme = action.payload;
      state.app.currentTheme = choosedTheme;
    },
    setSearchResult: (
      state,
      action: PayloadAction<{
        customers?: Customer[];
        employees?: Employee[];
        type: 'CUSTOMER' | 'EMPLOYEE';
      }>,
    ) => {
      const {customers, employees, type} = action.payload;
      if (customers && type === 'CUSTOMER') {
        state.app.searchResults.customerResults = customers;
      }
      if (employees && type === 'EMPLOYEE') {
        state.app.searchResults.employeeResults = employees;
      }
    },
    resetSearchResults: state => {
      state.app.searchResults.customerResults = [];
      state.app.searchResults.employeeResults = [];
    },
  },
});
export const {
  setUser,
  deleteUser,
  setTheme,
  setSearchResult,
  resetSearchResults,
} = UserSlice.actions;
export default UserSlice.reducer;

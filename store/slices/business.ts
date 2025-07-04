import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  Owner,
  App,
  Customer,
  AppTheme,
  Employee,
  Partner,
  Event,
} from '../../types';
import {CurrencyType} from '../../enums';
import 'react-native-get-random-values';
import {Theme} from '../../src/utils/Constants';

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
    defaultTheme: Theme[3],
    previousOwners: [],
    deviceId: undefined,
    appLocked: false,
    lc_meta_data: {
      upi_id: {
        valid: false,
        id: '',
      },
      visible_name: 'onlySales',
      visible_message: 'Thanks for purchase.',
    },
  },
};

const UserSlice = createSlice({
  name: 'user',
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
    setPymtId: (state, action: PayloadAction<string>) => {
      if (action.payload.length > 0) {
        state.app.lc_meta_data.upi_id.valid = true;
        state.app.lc_meta_data.upi_id.id = action.payload;
      }
    },
    setVisibleName: (state, action: PayloadAction<string>) => {
      state.app.lc_meta_data.visible_name = action.payload;
    },
    setVisibleMessage: (state, action: PayloadAction<string>) => {
      state.app.lc_meta_data.visible_message = action.payload;
    },
    setLockedState: (state, action: PayloadAction<boolean>) => {
      state.app.appLocked = action.payload;
    },
  },
});
export const {
  setUser,
  deleteUser,
  setTheme,
  setSearchResult,
  resetSearchResults,
  setPymtId,
  setVisibleMessage,
  setVisibleName,
  setLockedState,
} = UserSlice.actions;
export default UserSlice.reducer;

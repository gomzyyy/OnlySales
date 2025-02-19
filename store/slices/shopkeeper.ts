import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {d} from '../../_data/dummy_data';
import {Shopkeeper, App, Customer} from '../../types';
import {AdminRole, AppThemeName, BusinessType} from '../../enums';
import {AppState} from 'react-native';

type ShopkeeperInitialStateType = {
  shopkeeper: Shopkeeper;
  app: App;
};

const initialState: ShopkeeperInitialStateType = {
  shopkeeper: {
    id: '1',
    name: 'Gomzy Dhingra',
    role: AdminRole.SHOPKEEPER,
    image: undefined,
    businessType: BusinessType.RETAIL,
    shelf: [],
    starProducts: [],
    sessionPasscode: undefined,
    customers: d.customers,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  app: {
    currency: 'Rs.',
    serchResults: [],
    currentTheme: AppThemeName.PURPLE,
  },
};

const shopkeeperSlice = createSlice({
  name: 'shopkeeper',
  initialState,
  reducers: {
    setSearchResult: (state, action: PayloadAction<Customer[]>) => {
      state.app.serchResults = action.payload;
    },
    resetSearchResults: state => {
      state.app.serchResults = [];
    },
    createCustomers: (state, action: PayloadAction<Customer>) => {
      const currentCustomers: Customer[] = state.shopkeeper.customers;
      const newCustomer: Customer = action.payload;

      state.shopkeeper.customers = [newCustomer, ...currentCustomers];
    },
    updateCustomers: (state, action: PayloadAction<Customer>) => {
      const updatedCustomer = action.payload;
      state.shopkeeper.customers = state.shopkeeper.customers.map(s =>
        s.id === updatedCustomer.id ? {...s, ...updateCustomers} : s,
      );
    },
    removeCustomer: (state, action: PayloadAction<Customer>) => {
      const deletedCustomer = action.payload;
      state.shopkeeper.customers = state.shopkeeper.customers.filter(
        s => s.id !== deletedCustomer.id,
      );
    },
    setTheme: (state, action: PayloadAction<AppThemeName>) => {
      const choosedTheme:AppThemeName = action.payload;
      state.app.currentTheme = choosedTheme;
    },
  },
});
export const {
  createCustomers,
  updateCustomers,
  removeCustomer,
  setSearchResult,
  resetSearchResults,
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;

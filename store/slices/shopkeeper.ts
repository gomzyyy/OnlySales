import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {d} from '../../_data/dummy_data';
import {Shopkeeper, App, Customer, Product} from '../../types';
import {AdminRole, AppThemeName, BusinessType} from '../../enums';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';

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
    menu: [],
    starProducts: [],
    sessionPasscode: undefined,
    customers: d.customers,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  },
  app: {
    currency: 'Rs.',
    searchResults: [],
    currentTheme: AppThemeName.PURPLE,
  },
};

const shopkeeperSlice = createSlice({
  name: 'shopkeeper',
  initialState,
  reducers: {
    setSearchResult: (state, action: PayloadAction<Customer[]>) => {
      state.app.searchResults = action.payload;
    },
    resetSearchResults: state => {
      state.app.searchResults = [];
    },
    createCustomers: (
      state,
      action: PayloadAction<{
        fullName: string;
        phoneNumber: string;
        address: string;
      }>,
    ) => {
      const currentCustomers: Customer[] = state.shopkeeper.customers;
      const newCustomer: Customer = {
        ...action.payload,
        id: Date.now().toString(),
        shopkeeperId: state.shopkeeper.id,
        createdAt: new Date(Date.now()).toDateString(),
        updatedAt: new Date(Date.now()).toDateString(),
      };

      state.shopkeeper.customers = [newCustomer, ...currentCustomers];
    },
    updateCustomers: (state, action: PayloadAction<Customer>) => {
      const updatedCustomer = action.payload;
      state.shopkeeper.customers = state.shopkeeper.customers.map(s =>
        s.id === updatedCustomer.id ? {...s, ...updatedCustomer} : s,
      );
    },
    removeCustomer: (state, action: PayloadAction<Customer>) => {
      const deletedCustomer = action.payload;
      state.shopkeeper.customers = state.shopkeeper.customers.filter(
        s => s.id !== deletedCustomer.id,
      );
    },
    setTheme: (state, action: PayloadAction<AppThemeName>) => {
      const choosedTheme: AppThemeName = action.payload;
      state.app.currentTheme = choosedTheme;
    },
    addProduct: (
      state,
      action: PayloadAction<{customer: Customer; product: Product}>,
    ) => {},
    removeProduct: (
      state,
      action: PayloadAction<{customer: Customer; product: Product}>,
    ) => {},

    setToPaid: (state, action: PayloadAction<{customer: Customer}>) => {},
    setToUnpaid: (state, action: PayloadAction<{customer: Customer}>) => {},
    addProductToShelf: (state, action: PayloadAction<{product: Product}>) => {},
    editShelfProduct: (state, action: PayloadAction<{product: Product}>) => {},
    removeProductFromShelf: (
      state,
      action: PayloadAction<{product: Product}>,
    ) => {},
  },
});
export const {
  createCustomers,
  updateCustomers,
  removeCustomer,
  setSearchResult,
  resetSearchResults,
  addProduct,
  removeProduct,
  setToPaid,
  setToUnpaid,
  addProductToShelf,
  editShelfProduct,
  removeProductFromShelf,
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;

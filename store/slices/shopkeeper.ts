import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {d} from '../../_data/dummy_data';
import {Shopkeeper, App, Customer, Product, newUdharProduct} from '../../types';
import {AdminRole, AppThemeName, BusinessType} from '../../enums';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import UnpaidUdhars from '../../src/screens/Customer/UnpaidUdhars';

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
    addNewUdhar: (
      state,
      action: PayloadAction<{customer: Customer; products: newUdharProduct[]}>,
    ) => {
      const newUdharList = action.payload.products;
      const customer = action.payload.customer;

      const allUdhars =
        state.shopkeeper.customers.find(s => s.id === customer.id)
          ?.unpaidPayments || [];

      const newAllUdhars = allUdhars.map(d => {
        const updatedUdhar = newUdharList.find(c => c.id === d.id);
        console.log(updatedUdhar)
        return updatedUdhar ? {...d, count: (Number(d.count) + Number(updatedUdhar.count)).toString()} : d;
      });

      state.shopkeeper.customers = state.shopkeeper.customers.map(s =>
        s.id === customer.id
          ? {
              ...s,
              unpaidPayments: [
                ...newAllUdhars,
                ...newUdharList.filter(
                  c => !allUdhars.some(d => d.id === c.id),
                ),
              ],
            }
          : s,
      );
    },

    removeUdhar: (
      state,
      action: PayloadAction<{customer: Customer; product: Product}>,
    ) => {
      const customers = state.shopkeeper.customers;
      const customer = action.payload.customer;
      const newUnpaidPaymentsList =
        customer.unpaidPayments &&
        customer.unpaidPayments.filter(s => s.id !== action.payload.product.id);
      state.shopkeeper.customers = customers.map(c =>
        c.id === customer.id ? {...c, UnpaidUdhars: newUnpaidPaymentsList} : c,
      );
    },

    setToPaid: (
      state,
      action: PayloadAction<{customer: Customer; product: newUdharProduct}>,
    ) => {
      const customers = state.shopkeeper.customers;
      const customer = action.payload.customer;
      const product = action.payload.product;
      const newUnpaidPaymets = customer.unpaidPayments?.filter(
        s => s.id !== product.id,
      );
      const newPaidPayments = [product, ...(customer.paidPayments || [])];
      state.shopkeeper.customers = customers.map(c =>
        c.id === customer.id
          ? {
              ...c,
              unpaidPayments: newUnpaidPaymets,
              paidPayments: newPaidPayments,
            }
          : c,
      );
    },
    setToUnpaid: (
      state,
      action: PayloadAction<{customer: Customer; product: newUdharProduct}>,
    ) => {
      const customers = state.shopkeeper.customers;
      const customer = action.payload.customer;
      const product = action.payload.product;
      const newUnpaidPaymets = [product, ...(customer.unpaidPayments || [])];
      const newPaidPayments = customer.paidPayments?.filter(
        s => s.id !== product.id,
      );
      state.shopkeeper.customers = customers.map(c =>
        c.id === customer.id
          ? {
              ...c,
              unpaidPayments: newUnpaidPaymets,
              paidPayments: newPaidPayments,
            }
          : c,
      );
    },
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
  addNewUdhar,
  removeUdhar,
  setToPaid,
  setToUnpaid,
  addProductToShelf,
  editShelfProduct,
  removeProductFromShelf,
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;

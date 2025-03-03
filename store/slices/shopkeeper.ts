import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {d} from '../../_data/dummy_data';
import {Shopkeeper, App, Customer, Product, newUdharProduct,AppTheme} from '../../types';
import {AdminRole, AppThemeName, BusinessType} from '../../enums';
import 'react-native-get-random-values';
import { Theme } from '../../src/utils/Constants';

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
    currentTheme: undefined,
    defaultTheme: Theme[0]
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
    updateCustomer: (state, action: PayloadAction<Customer>) => {
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
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      const choosedTheme: AppTheme = action.payload;
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

      const updatedUdhars = allUdhars.map(d => {
        const updatedUdhar = newUdharList.find(c => c.id === d.id);
        return updatedUdhar ? {...d, count: d.count + updatedUdhar.count} : d;
      });

      const newUnpaidUdhars = newUdharList.filter(
        c => !allUdhars.some(d => d.id === c.id),
      );

      const newAllUdhars = [...updatedUdhars, ...newUnpaidUdhars];

      state.shopkeeper.customers = state.shopkeeper.customers.map(s =>
        s.id === customer.id ? {...s, unpaidPayments: newAllUdhars} : s,
      );
      state.shopkeeper.menu = state.shopkeeper.menu.map(s => {
        const foundProduct = newAllUdhars.find(d => s.id === d.id);
        return foundProduct
          ? {...s, totalSold: (s.totalSold || 0) + foundProduct.count}
          : s;
      });
    },

    removeUdhar: (
      state,
      action: PayloadAction<{customer: Customer; product: newUdharProduct}>,
    ) => {
      const {customer, product} = action.payload;

      // Find the customer in the state
      const customerIndex = state.shopkeeper.customers.findIndex(
        c => c.id === customer.id,
      );

      if (customerIndex !== -1) {
        // Ensure we create a new array reference to trigger state updates
        state.shopkeeper.customers[customerIndex] = {
          ...state.shopkeeper.customers[customerIndex],
          unpaidPayments:
            state.shopkeeper.customers[customerIndex].unpaidPayments?.filter(
              s => s.id !== product.id,
            ) || [],
        };
      }
    },
    removePaidUdhar: (
      state,
      action: PayloadAction<{customer: Customer; product: newUdharProduct}>,
    ) => {
      const {customer, product} = action.payload;

      const customerIndex = state.shopkeeper.customers.findIndex(
        c => c.id === customer.id,
      );

      if (customerIndex !== -1) {
        state.shopkeeper.customers[customerIndex] = {
          ...state.shopkeeper.customers[customerIndex],
          paidPayments:
            state.shopkeeper.customers[customerIndex].paidPayments?.filter(
              s => s.id !== product.id,
            ) || [],
        };
      }
    },

    setToPaid: (
      state,
      action: PayloadAction<{customer: Customer; product: newUdharProduct}>,
    ) => {
      const customers = state.shopkeeper.customers;
      const customer = action.payload.customer;
      const product = action.payload.product;
      console.log(customer.paidPayments)
      const newUnpaidPaymets = (customer.unpaidPayments || []).filter(
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
      const newPaidPayments = (customer.paidPayments || []).filter(
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
    addProductToShelf: (state, action: PayloadAction<{product: Product}>) => {
      const newProduct = action.payload.product;
      const menu = state.shopkeeper.menu;
      state.shopkeeper.menu = [newProduct, ...state.shopkeeper.menu];
    },
    editShelfProduct: (state, action: PayloadAction<{product: Product}>) => {
      // const updatedProduct
    },
    removeProductFromShelf: (
      state,
      action: PayloadAction<{product: Product}>,
    ) => {
      const removedProduct = action.payload.product;
      const menu = state.shopkeeper.menu;
      const newMenu = menu.filter(s => s.id !== removedProduct.id);
      state.shopkeeper.menu = newMenu;
    },
  },
});
export const {
  createCustomers,
  updateCustomer,
  removeCustomer,
  setSearchResult,
  resetSearchResults,
  addNewUdhar,
  removeUdhar,
  removePaidUdhar,
  setToPaid,
  setToUnpaid,
  addProductToShelf,
  editShelfProduct,
  removeProductFromShelf,
  setTheme
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;

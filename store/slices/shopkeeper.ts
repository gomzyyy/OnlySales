import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {d} from '../../_data/dummy_data';
import {
  Shopkeeper,
  App,
  Customer,
  Product,
  newSoldProduct,
  AppTheme,
} from '../../types';
import {AdminRole, BusinessType} from '../../enums';
import 'react-native-get-random-values';
import {Theme} from '../../src/utils/Constants';
import {randomId, showToast} from '../../src/service/fn';

type ShopkeeperInitialStateType = {
  shopkeeper: Shopkeeper;
  app: App;
};

const initialState: ShopkeeperInitialStateType = {
  shopkeeper: {
    id: '1',
    name: '',
    userId: '',
    businessName: '',
    phoneNumber: undefined,
    sessionId: null,
    role: AdminRole.SHOPKEEPER,
    image: undefined,
    businessType: BusinessType.RETAIL,
    inventory: [],
    starProducts: [],
    accessPasscode: undefined,
    customers: d.customers,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  },
  app: {
    currency: 'Rs.',
    searchResults: [],
    currentTheme: undefined,
    defaultTheme: Theme[0],
    previousShopkeepers: [],
    deviceId: undefined,
    appLocked: false,
  },
};

const shopkeeperSlice = createSlice({
  name: 'shopkeeper',
  initialState,
  reducers: {
    setShopkeeper: (
      state,
      action: PayloadAction<{
        name: string;
        userId: string;
        businessName?: string;
        phoneNumber?: string;
        businessType?: BusinessType;
      }>,
    ) => {
      const {name, userId, phoneNumber, businessType, businessName} =
        action.payload;
      if (!name || !userId) {
        showToast({type: 'info', text1: 'Error: Shopkeeper.ts;'});
        return;
      }
      const prevShopkeeper = state.app.previousShopkeepers;
      const ifExisting = prevShopkeeper.find(s => s.userId === userId);
      if (ifExisting) return;
      const newShopkeeper: Shopkeeper = {
        id: randomId(),
        name,
        userId,
        phoneNumber: phoneNumber,
        sessionId: Date.now(),
        role: AdminRole.SHOPKEEPER,
        businessName,
        businessType,
        inventory: [],
        customers: [],
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      };
      state.app.previousShopkeepers.push(newShopkeeper);
      state.shopkeeper = newShopkeeper;
    },
    toogleLockApp: (state, action: PayloadAction<boolean>) => {
      state.app.appLocked = action.payload;
    },
    editShopkeeper: (
      state,
      action: PayloadAction<{
        name: string;
        userId: string;
        phoneNumber?: string;
        businessType?: BusinessType;
      }>,
    ) => {
      const {name, userId, phoneNumber, businessType} = action.payload;
      const prevShopkeeper = state.app.previousShopkeepers;
      const ifExisting = prevShopkeeper.find(s => s.userId === userId);
      if (!ifExisting) return;
      const newShopkeeper: Shopkeeper = {
        ...ifExisting,
        name,
        phoneNumber,
        businessType: businessType ?? BusinessType.RETAIL,
        updatedAt: Date.now().toString(),
      };
      const newPrevShopkeepers = state.app.previousShopkeepers.map(s =>
        s.userId === ifExisting.userId ? newShopkeeper : s,
      );
      state.app.previousShopkeepers = newPrevShopkeepers;
      state.shopkeeper = newShopkeeper;
    },
    removeExistingUser: (state, action: PayloadAction<{userId: string}>) => {
      const {userId} = action.payload;
      const prevShopkeeper = state.app.previousShopkeepers;
      const user = prevShopkeeper.find(s => s.userId === userId);
      if (!user) return;
      const newPrevUsersArr = prevShopkeeper.filter(s => s.userId !== userId);
      state.app.previousShopkeepers = newPrevUsersArr;
    },
    setAccessPassword: (
      state,
      action: PayloadAction<[string, string, string, string]>,
    ) => {
      const newAccessPasscode = action.payload;

      state.shopkeeper.accessPasscode = newAccessPasscode;
    },
    login: (state, action: PayloadAction<{userId: string}>) => {
      const prevUsers = state.app.previousShopkeepers;
      const {userId} = action.payload;
      const user = prevUsers.find(s => s.userId === userId);
      if (!user) return;
      const existingUser = {...user, sessionId: Date.now()};
      if (!existingUser) {
        return;
      }
      state.shopkeeper = existingUser;
    },
    logout: (state, action: PayloadAction<{userId: string}>) => {
      const {userId} = action.payload;
      const currUser = state.shopkeeper;
      const user = state.app.previousShopkeepers.find(s => s.userId === userId);
      if (!user) return;
      const updatedPrevUsers = state.app.previousShopkeepers.map(s =>
        s.userId === userId ? {...currUser, sessionId: null} : s,
      );
      state.app.previousShopkeepers = updatedPrevUsers;
      state.shopkeeper.sessionId = null;
    },
    setSearchResult: (state, action: PayloadAction<Customer[]>) => {
      state.app.searchResults = action.payload;
    },
    resetSearchResults: state => {
      state.app.searchResults = [];
    },
    createCustomers: (
      state,
      action: PayloadAction<{
        name: string;
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
      console.log(newCustomer);
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
      action: PayloadAction<{customer: Customer; products: newSoldProduct[]}>,
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
      const updatedCustomers = state.shopkeeper.customers.map(s =>
        s.id === customer.id ? {...s, unpaidPayments: newAllUdhars} : s,
      );
      state.shopkeeper.customers = updatedCustomers;
      const newInventory = state.shopkeeper.inventory.map(s => {
        const foundProduct = newUdharList.find(d => s.id === d.id);
        return foundProduct
          ? {
              ...s,
              totalSold: (s.totalSold || 0) + foundProduct.count,
              stock: (s.stock || 0) - foundProduct.count,
            }
          : s;
      });
      state.shopkeeper.inventory = newInventory;
    },

    removeUdhar: (
      state,
      action: PayloadAction<{customer: Customer; product: newSoldProduct}>,
    ) => {
      const {customer, product} = action.payload;
      const customerIndex = state.shopkeeper.customers.findIndex(
        c => c.id === customer.id,
      );

      if (customerIndex !== -1) {
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
      action: PayloadAction<{customer: Customer; product: newSoldProduct}>,
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
      action: PayloadAction<{customer: Customer; product: newSoldProduct}>,
    ) => {
      const customers = state.shopkeeper.customers;
      const {customer, product} = action.payload;

      const updatedCustomers = customers.map(c => {
        if (c.id === customer.id) {
          const newUnpaidPayments = (c.unpaidPayments ?? []).filter(
            s => s.id !== product.id,
          );

          const newPaidPayments = [product, ...(c.paidPayments ?? [])];

          return {
            ...c,
            unpaidPayments: newUnpaidPayments,
            paidPayments: newPaidPayments,
          };
        }
        return c;
      });

      state.shopkeeper.customers = updatedCustomers;
    },

    setToUnpaid: (
      state,
      action: PayloadAction<{customer: Customer; product: newSoldProduct}>,
    ) => {
      const customers = state.shopkeeper.customers;
      const {customer, product} = action.payload;

      const updatedCustomers = customers.map(c => {
        if (c.id === customer.id) {
          return {
            ...c,
            unpaidPayments: [product, ...(c.unpaidPayments ?? [])],
            paidPayments: (c.paidPayments ?? []).filter(
              s => s.id !== product.id,
            ),
          };
        }
        return c;
      });
      state.shopkeeper.customers = updatedCustomers;
    },

    addProductToInventory: (
      state,
      action: PayloadAction<{product: Product}>,
    ) => {
      const newProduct = action.payload.product;
      state.shopkeeper.inventory = [newProduct, ...state.shopkeeper.inventory];
    },
    editInventoryProduct: (
      state,
      action: PayloadAction<{product: Product}>,
    ) => {
      const {product} = action.payload;
      const foundProduct = state.shopkeeper.inventory.find(
        s => s.id === product.id,
      );
      if (foundProduct) {
        Object.assign(foundProduct, {
          ...product,
          updatedAt: Date.now().toString(),
        });
      }
    },
    removeProductFromInventory: (
      state,
      action: PayloadAction<{product: Product}>,
    ) => {
      const {product} = action.payload;
      const newInventory = state.shopkeeper.inventory.filter(
        s => s.id !== product.id,
      );
      state.shopkeeper.inventory = newInventory;
    },
  },
});
export const {
  setShopkeeper,
  editShopkeeper,
  logout,
  login,
  toogleLockApp,
  setAccessPassword,
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
  addProductToInventory,
  editInventoryProduct,
  removeProductFromInventory,
  setTheme,
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;

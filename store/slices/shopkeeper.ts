import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {d} from '../../_data/dummy_data';
import {
  Shopkeeper,
  App,
  Customer,
  Product,
  newUdharProduct,
  AppTheme,
} from '../../types';
import {AdminRole, BusinessType} from '../../enums';
import 'react-native-get-random-values';
import {Theme} from '../../src/utils/Constants';
import {randomId} from '../../src/service/fn';

type ShopkeeperInitialStateType = {
  shopkeeper: Shopkeeper;
  app: App;
};

const initialState: ShopkeeperInitialStateType = {
  shopkeeper: {
    id: '1',
    name: 'Gomzy Dhingra',
    userId: 'gomzy_dhingra',
    phoneNumber: '9781295937',
    sessionId: null,
    role: AdminRole.SHOPKEEPER,
    image: undefined,
    businessType: BusinessType.RETAIL,
    menu: [],
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
        phoneNumber?: string;
        businessType?: BusinessType;
      }>,
    ) => {
      const {name, userId, phoneNumber, businessType} = action.payload;
      const prevShopkeeper = state.app.previousShopkeepers;
      const ifExisting = prevShopkeeper.find(s => s.userId);
      if (ifExisting) return;
      const newShopkeeper: Shopkeeper = {
        id: randomId(),
        name,
        userId,
        phoneNumber: phoneNumber,
        sessionId: Date.now(),
        role: AdminRole.SHOPKEEPER,
        businessType: businessType ?? BusinessType.RETAIL,
        menu: [],
        customers: [],
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      };
      state.app.previousShopkeepers.push(newShopkeeper);
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
      action: PayloadAction<{customer: Customer; product: newUdharProduct}>,
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

    addProductToMenu: (state, action: PayloadAction<{product: Product}>) => {
      const newProduct = action.payload.product;
      state.shopkeeper.menu = [newProduct, ...state.shopkeeper.menu];
    },
    editShelfProduct: (state, action: PayloadAction<{product: Product}>) => {
      const {product} = action.payload;
      const foundProduct = state.shopkeeper.menu.find(s => s.id === product.id);
      if (foundProduct) {
        Object.assign(foundProduct, {
          ...product,
          updatedAt: Date.now().toString(),
        });
      }
    },
    removeProductFromMenu: (
      state,
      action: PayloadAction<{product: Product}>,
    ) => {
      const {product} = action.payload;
      const newMenu = state.shopkeeper.menu.filter(s => s.id !== product.id);
      state.shopkeeper.menu = newMenu;
    },
  },
});
export const {
  setShopkeeper,
  logout,
  login,
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
  addProductToMenu,
  editShelfProduct,
  removeProductFromMenu,
  setTheme,
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;

// const shopkeeper = action.payload;
// const storedUser = state.app.previousUsers.find(
//   s => s.id === shopkeeper.id,
// );
// if (!storedUser) {
//   state.app.previousShopkeepers.push({
//     ...shopkeeper,
//     id: randomId(),
//   });
// }
// state.shopkeeper = shopkeeper;

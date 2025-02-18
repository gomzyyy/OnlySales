import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {d} from '../../_data/dummy_data';
import {Shopkeeper, App, Customer} from '../../types';
import {BusinessType} from '../../enums';

type ShopkeeperInitialStateType = {
  shopkeeper: Shopkeeper;
  app: App;
};

const initialState: ShopkeeperInitialStateType = {
  shopkeeper: {
    id: '1',
    name: 'Gomzy Dhingra',
    image: null,
    businessType: BusinessType.RETAIL,
    shelf: [],
    starProducts: [],
    customers: d.customers,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  app: {
    serchResults: [],
  },
};

const shopkeeperSlice = createSlice({
  name: 'shopkeeper',
  initialState,
  reducers: {
    setSearchResult:(state,action:PayloadAction<Customer[]>)=>{
        state.app.serchResults = action.payload;
    },
    resetSearchResults:(state)=>{
        state.app.serchResults = []
    },
    setCustomers: (state, action) => {},
  },
});
export const {
    setCustomers,
    setSearchResult,
    resetSearchResults
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;

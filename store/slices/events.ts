import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Event, Order} from '../../types';
import 'react-native-get-random-values';

type eventstate = {
  eventData: {
    events: Event[];
    newEventCount: number;
  };
   orderData: {
    orders: Order[],
    newOrderCount: number,
  }
};

const initialState: eventstate = {
  eventData: {
    events: [],
    newEventCount: 0,
  },
  orderData: {
    orders: [],
    newOrderCount: 0,
  },
};

const EventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    handleEvents: (state, action: PayloadAction<Event[]>) => {
      const events = action.payload;
      state.eventData.events = [...events];
    },
    handleEventCount: (state, action: PayloadAction<1 | 0>) => {
      const newCount =
        action.payload === 1
          ? state.eventData.newEventCount + 1
          : state.eventData.newEventCount - 1;
      state.eventData.newEventCount = newCount;
    },
    resetEventCount: state => {
      state.eventData.newEventCount = 0;
    },
    handleOrders: (state, action: PayloadAction<Order[]>) => {
      const orders = action.payload;
      state.orderData.orders = [...orders];
    },
     handleOrderCount: (state, action: PayloadAction<1 | 0>) => {
      const newCount =
        action.payload === 1
          ? state.orderData.newOrderCount + 1
          : state.orderData.newOrderCount - 1;
      state.orderData.newOrderCount = newCount;
    },
        resetOrderCount: state => {
      state.orderData.newOrderCount = 0;
    },
  },
});
export const {handleEvents, handleEventCount, resetEventCount,handleOrders,handleOrderCount,resetOrderCount} =
  EventSlice.actions;
export default EventSlice.reducer;

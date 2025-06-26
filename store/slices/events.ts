import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, Order } from '../../types';
import 'react-native-get-random-values';

type eventstate = {
  eventData: {
    events: Event[];
    newEventCount: number;
  };
  orderData: {
    orders: Order[];
    newOrderCount: number;
  };
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
      state.eventData.events = [...action.payload];
    },
    handleEventCount: (state, action: PayloadAction<1 | 0>) => {
      state.eventData.newEventCount += action.payload === 1 ? 1 : -1;
    },
    resetEventCount: state => {
      state.eventData.newEventCount = 0;
    },
    handleOrders: (state, action: PayloadAction<Order[]>) => {
      state.orderData.orders = [...action.payload];
    },
    handleOrderCount: (state, action: PayloadAction<1 | 0>) => {
      state.orderData.newOrderCount += action.payload === 1 ? 1 : -1;
    },
    resetOrderCount: state => {
      state.orderData.newOrderCount = 0;
    },
    addNewOrder: (state, action: PayloadAction<Order>) => {
      state.orderData.orders = [action.payload, ...state.orderData.orders];
      state.orderData.newOrderCount += 1;
    },
    addNewEvent: (state, action: PayloadAction<Event>) => {
      state.eventData.events = [action.payload, ...state.eventData.events];
      state.eventData.newEventCount += 1;
    },
  },
});

export const {
  handleEvents,
  handleEventCount,
  resetEventCount,
  handleOrders,
  handleOrderCount,
  resetOrderCount,
  addNewOrder,
  addNewEvent,
} = EventSlice.actions;

export default EventSlice.reducer;

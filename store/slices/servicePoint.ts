import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ServicePoint} from '../../types';

export interface ServicePointSliceInitialState {
  points: ServicePoint[];
}

const initialState: ServicePointSliceInitialState = {
  points: [],
};

const ServicePointSlice = createSlice({
  name: 'servicePoint',
  initialState,
  reducers: {
    setPoints: (state, action: PayloadAction<ServicePoint[]>) => {
      state.points = action.payload;
    },
    addServicePoint: (state, action: PayloadAction<ServicePoint>) => {
      // state.points.push(action.payload);
      if (!state.points.some(p => p._id === action.payload._id)) {
        state.points.push(action.payload);
      }
    },
  },
});

export const {setPoints,addServicePoint} = ServicePointSlice.actions;
export default ServicePointSlice.reducer;

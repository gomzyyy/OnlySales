import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ServicePoint } from '../../types';

export interface ServicePointSliceInitialState {
 points:ServicePoint[]
}

const initialState: ServicePointSliceInitialState = {
 points:[]
};

const ServicePointSlice = createSlice({
  name: 'servicePoint',
  initialState,
  reducers: {
   setPoints:(state,action:PayloadAction<ServicePoint[]>)=>{
    state.points = action.payload
   }
  },
});

export const {setPoints} =
  ServicePointSlice.actions;
export default ServicePointSlice.reducer;

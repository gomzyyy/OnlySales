import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessTiming, HolidaySlot } from '../../types';

type eventstate = {
  businessTimings: BusinessTiming[];
  holidaySlots: HolidaySlot[];
};

const initialState: eventstate = {
  businessTimings:[],
  holidaySlots: [],
};

const openCloseSlice = createSlice({
  name: 'openClose',
  initialState,
  reducers: {
    updateBusinessTimings:(s,a:PayloadAction<BusinessTiming[]>)=>{
        s.businessTimings = a.payload
        console.log(a)
    },
    updateHolidaySlots:(s,a:PayloadAction<HolidaySlot[]>)=>{
        s.holidaySlots = a.payload
    }
  }
});

export const {updateBusinessTimings,updateHolidaySlots} = openCloseSlice.actions;

export default openCloseSlice.reducer;

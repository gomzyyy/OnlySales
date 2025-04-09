import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type DeviceInfoSlice = {
  network: {
    isConnected: boolean;
  };
};

const initialState: DeviceInfoSlice = {
  network: {
    isConnected: false,
  },
};

const deviceInfoSlice = createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {
    setConnection: (
      state,
      action: PayloadAction<{connectionState: boolean}>,
    ) => {
      const {connectionState} = action.payload;
      state.network.isConnected = connectionState;
    },
  },
});

export const {setConnection} = deviceInfoSlice.actions;
export default deviceInfoSlice.reducer;

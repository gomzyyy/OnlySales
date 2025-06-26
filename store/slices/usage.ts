import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UsageSliceInitialState {
  features: {
    common: Record<string, any>;
    user_specific: Record<string, any>;
  };
}

export interface UpdateIntoCommonProps {
  unique_name: string;
  value: any;
}

export interface UpdateIntoPremiumProps {
  unique_name: string;
  value: any;
}

const initialState: UsageSliceInitialState = {
  features: {
    common: {},
    user_specific: {},
  },
};

const UsageSlice = createSlice({
  name: 'usage',
  initialState,
  reducers: {
    updateIntoCommon: (
      state,
      action: PayloadAction<UpdateIntoCommonProps>
    ) => {
      const { unique_name, value } = action.payload;
      state.features.common[unique_name] = value;
    },
    updateIntoUserSpecific: (
      state,
      action: PayloadAction<UpdateIntoPremiumProps>
    ) => {
      const { unique_name, value } = action.payload;
      state.features.user_specific[unique_name] = value;
    },
    clearCommon: (state) => {
      state.features.common = {};
    },
    clearUserSpecific: (state) => {
      state.features.user_specific = {};
    },
    clearAll: (state) => {
      state.features.common = {};
      state.features.user_specific = {};
    },
  },
});

export const {
  updateIntoCommon,
  updateIntoUserSpecific,
  clearCommon,
  clearUserSpecific,
  clearAll,
} = UsageSlice.actions;

export default UsageSlice.reducer;

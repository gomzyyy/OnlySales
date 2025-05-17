import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface CacheSliceInitialState {
  cache: Record<string, {data: any; timestamps: number}>;
  expiresIn: number;
}

const initialState: CacheSliceInitialState = {
  cache: {},
  expiresIn: 0.5,
};

const CacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<{key: string; data: any}>) => {
      const {key, data} = action.payload;
      state.cache[key] = {data, timestamps: Date.now()};
      console.log(state.cache);
    },
    clear: state => {
      state.cache = {};
    },
    reset: () => initialState,
    setExpiry: (state, action: PayloadAction<0.5 | 1 | 1.5 | 2>) => {
      const exp = action.payload;
      state.expiresIn = exp;
    },
    deleteOne: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.cache.hasOwnProperty(key)) {
        delete state.cache[key];
      }
    },
    deleteExpired: state => {
      const now = Date.now();
      const expiryThreshold = now - 1000 * 60 * state.expiresIn;
      Object.keys(state.cache).forEach(key => {
        if (state.cache[key].timestamps < expiryThreshold) {
          delete state.cache[key];
        }
      });
    },
  },
});

export const {addOne, clear, reset, deleteOne, deleteExpired} =
  CacheSlice.actions;
export default CacheSlice.reducer;

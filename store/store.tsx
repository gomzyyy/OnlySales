import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import {Provider} from 'react-redux';
import {mmkv} from '../src/storage/mmkv';
import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import UserSliceFunction from './slices/business';
import DeviceInfoSliceFunction from './slices/device';
import CacheSliceFunction from './slices/cache';
import EventSliceFunction from './slices/events';
import NoteSliceFunction from './slices/notes';
import UsageSliceFunction from './slices/usage';
import ServicePointSliceFunction from './slices/servicePoint';
import OpenCloseSliceFunction from './slices/openClose'

const persistConfig = {
  key: 'eregavkwrnovrhoC249WBotEGUliqewebWwfetr',
  storage: mmkv,
  blacklist: ['deviceInfo'],
};

const rootReducer = combineReducers({
  appData: UserSliceFunction,
  deviceInfo: DeviceInfoSliceFunction,
  cache: CacheSliceFunction,
  events: EventSliceFunction,
  notes: NoteSliceFunction,
  usage: UsageSliceFunction,
  servicePoints: ServicePointSliceFunction,
  openClose: OpenCloseSliceFunction
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: GetDefaultMiddleware =>
    GetDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

const ReduxProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>{children}</Provider>
    </PersistGate>
  );
};
export default ReduxProvider;

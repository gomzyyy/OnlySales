import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import {Provider} from 'react-redux';
import {mmkv} from '../src/storage/mmkv';
import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import shopkeeperSliceFunction from "./slices/shopkeeper"

const persistConfig = {
  key: 'eregaedartbtr',
  storage: mmkv,
};

const rootReducer = combineReducers({
  shopkeeper:shopkeeperSliceFunction
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: GetDefaultMiddleware =>
    GetDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)


const ReduxProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>{children}</Provider>
      </PersistGate>
    )
};
export default ReduxProvider;

import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import {Provider} from 'react-redux';
import {mmkv} from '../src/storage/mmkv';
import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';

const persistConfig = {
  key: 'khata',
  storage: mmkv,
};

const rootReducer = combineReducers({});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: GetDefaultMiddleware =>
    GetDefaultMiddleware({
      serializableCheck: false,
    }),
});

const ReduxProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <PersistGate persistor={persistStore(store)}>
        <Provider store={store}>{children}</Provider>
      </PersistGate>
    )
 
};
export default ReduxProvider;

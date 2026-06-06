import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cartReducer     from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer     from './slices/authSlice';
import productReducer  from './slices/productSlice';
import uiReducer       from './slices/uiSlice';
import orderReducer    from './slices/orderSlice';

const persistConfig = {
  key: 'vanya-mobile-root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['cart', 'wishlist', 'auth', 'order'],
};

const rootReducer = combineReducers({
  cart:     cartReducer,
  wishlist: wishlistReducer,
  auth:     authReducer,
  product:  productReducer,
  ui:       uiReducer,
  order:    orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState   = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

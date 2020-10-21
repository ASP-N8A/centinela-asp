import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './Slices/accountSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});

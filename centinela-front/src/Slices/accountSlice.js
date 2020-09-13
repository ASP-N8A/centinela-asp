import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState = {
  authenticated: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    login: (state) => {
      state.authenticated = true;
    },
    logout: (state) => {
      state.authenticated = false;
    },
  },
});

export const { login, logout } = accountSlice.actions;

export const selectAuthenticated = (state) => state.account.authenticated;

export default accountSlice.reducer;

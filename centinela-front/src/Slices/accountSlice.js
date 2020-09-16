import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  authenticated: false,
  user: undefined,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    login: (state, action) => {
      state.authenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.authenticated = false;
    },
  },
});

export const { login, logout } = accountSlice.actions;

export const selectAuthenticated = (state) => state.account.authenticated;
export const selectUser = (state) => state.account.user;

export default accountSlice.reducer;

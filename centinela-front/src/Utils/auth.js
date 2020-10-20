import axios from 'axios';
import Cookies from 'js-cookie';

import { API_URL } from './config';

const getToken = () => Cookies.get('token');
const getRefreshToken = () => Cookies.get('refreshToken');
const isAuthenticated = () => !!getToken();
const isAdmin = () => Cookies.get('role') === 'admin';
const storeToken = (token, refreshToken) => {
  Cookies.set('token', token, {
    sameSite: 'strict',
  });
  Cookies.set('refreshToken', refreshToken, {
    sameSite: 'strict',
  });
}
const clear = () => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');
};
const getNewToken = () =>
  axios
    .post(`${API_URL}/auth/refresh-tokens`, {
      refreshToken: getRefreshToken(),
    })
    .then((response) => {
      storeToken(response.data.access.token, response.data.refresh.token);
      return response.data.access.token;
    })
    .catch((error) => error);

export default {
  getToken,
  isAuthenticated,
  isAdmin,
  storeToken,
  clear,
  getNewToken,
};

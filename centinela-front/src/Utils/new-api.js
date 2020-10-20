import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { useHistory } from 'react-router-dom';

import auth from './auth';
import { API_URL } from './config';

const api = axios.create({
  baseURL: API_URL, // TODO: Use env variables
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  // Return a successful response back to the calling service
  (response) => {
    return response;
  },
  async (error) => {
    // Return any error which is not due to authentication back to the calling service
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Send to login page if no token stored
    if (!auth.isAuthenticated()) {
      // Router.replace('/login');
      useHistory().replace('/login');
      return Promise.reject(error);
    }

    // Logout user if token refresh didn't work
    if (error.config.url === '/api-token-refresh/') {
      Cookies.remove('token');
      Router.replace('/login');

      return Promise.reject(error);
    }

    // Try request again with new token
    const newToken = await auth.getNewToken();
    const { config } = error;
    config.headers.Authorization = `Bearer ${newToken}`;

    return axios.request(config);
  },
);

export const getData = async (endpoint, options = {}) => {
  const { data } = await api.get(endpoint, options);
  return data;
};

export default api;

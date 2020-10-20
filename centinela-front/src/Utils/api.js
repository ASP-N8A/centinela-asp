import axios from 'axios';
import { API_URL } from './config';

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common.Accept = 'application/json, application/octet-stream';

/** ISSUES ROUTES */
export const fetchIssues = (page) => {
  return axios.get(`/issues?page=${page}`);
};

export const fetchIssue = (id) => {
  return axios.get(`/issues/${id}`);
};

export const patchIssue = async ({ values, id }) => {
  const { data } = await axios.patch(`/issues/${id}`, values);
  return data;
};


import axios from 'axios';
import { API_URL } from './config';

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common.Accept = 'application/json, application/octet-stream';

export const setAuthToken = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

/** AUTH ROUTES */
export const signUp = async ({ values, invitationId, organizationToJoin }) => {
  const url = invitationId ? 'auth/registerUser' : '/auth/register';
  const newValues = invitationId
    ? { ...values, organization: organizationToJoin, invitationId }
    : values;
  const { data } = await axios.post(url, newValues);
  const { user, tokens } = data;
  setAuthToken(tokens.access.token);
  return user;
};

export const login = async ({ email, password }) => {
  const { data } = await axios.post('/auth/login', {
    email,
    password,
  });
  const { user, tokens } = data;
  setAuthToken(tokens.access.token);

  return user;
};

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

/** INVITE */
export const sendInvitation = async ({ email, role }) => {
  const { data } = await axios.post('/invitations', {
    email,
    role,
  });
  return data;
};

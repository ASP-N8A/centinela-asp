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

export const fetchIssue = (id, onSuccess, onError) => {
  axios
    .get(`/issues/${id}`)
    .then(function (response) {
      onSuccess(response.data);
    })
    .catch(function (error) {
      debugger;
      onError(error);
    });
};

/** KEY ROUTES */
export const createKey = ({ name }, onSuccess, onError) => {
  axios
    .post('/keys', {
      name,
    })
    .then(function () {
      onSuccess();
    })
    .catch(function (error) {
      onError(error.response.data);
    });
};

/** INVITE */
export const sendInvitation = ({ email, role }, onSuccess, onError) => {
  axios
    .post('/invitations', {
      email,
      role,
    })
    .then(function () {
      onSuccess();
    })
    .catch(function (error) {
      onError(error.response.data);
    });
};

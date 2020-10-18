import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common.Accept = 'application/json, application/octet-stream';

export const setAuthToken = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

/** AUTH ROUTES */
export const createOrgAndUser = ({ name, email, password, organization }, onSuccess, onError) => {
  axios
    .post('/auth/register', {
      organization,
      name,
      email,
      password,
    })
    .then(function (response) {
      const {
        data: { tokens, user },
      } = response;
      setAuthToken(tokens.access.token);
      onSuccess(user);
    })
    .catch(function (error) {
      onError(error.response.data);
    });
};

export const login = ({ email, password }, onSuccess, onError) => {
  axios
    .post('/auth/login', {
      email,
      password,
    })
    .then(function (response) {
      const {
        data: { tokens, user },
      } = response;
      setAuthToken(tokens.access.token);
      onSuccess(user);
    })
    .catch(function (error) {
      onError(error.response.data);
    });
};

/** ISSUES ROUTES */
export const fetchIssues = (page) => {
  return axios.get(`/issues?page=${page}`);
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

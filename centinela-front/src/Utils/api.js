import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common.Accept = 'application/json, application/octet-stream';

export const setAuthToken = (token) => {
  axios.defaults.headers.common.Authorization = `bearer ${token}`;
};
export const createOrgAndUser = ({ name, email, password, organization }, onSuccess, onError) => {
  console.log("process.env.REACT_APP_API_URL", process.env.REACT_APP_API_URL);
  axios
    .post('/auth/register', {
      organization,
      name,
      email,
      password,
    })
    .then(function (response) {
      const { data : {tokens, user} } = response;
      setAuthToken(tokens.access.token);
      onSuccess(user);
    })
    .catch(function (error) {
      onError(error.response.data);
    });
};

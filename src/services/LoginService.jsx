import axios from 'axios';

const login = (email, password) => {
  return axios.post('/login', {
    email: email,
    password: password,
  });
};

const LoginService = {
  login: login,
};

export default LoginService;
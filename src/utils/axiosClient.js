import axios from 'axios';
import { getCookie } from './helpers';

const token = getCookie('token');

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default instance;

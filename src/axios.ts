import axios from 'axios';

import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
export const BASE_URL = 'https://myclassroomapi-v6.onrender.com/api/v1';

export default axios.create({
  baseURL: BASE_URL,
});

let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') || '') : '';
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async req => {
  if (!authTokens) {
    authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') || '') : null;
  }

  if (authTokens) {
    req.headers.Authorization = ` Bearer ${authTokens?.access_token}`;
  }

  const user = jwtDecode(authTokens.access_token);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) return req;

  localStorage.setItem('authTokens', '');

  return req;
});

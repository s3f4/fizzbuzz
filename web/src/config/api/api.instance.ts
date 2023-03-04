import axios from 'axios';
import { config } from '..';
import { onResponse, onResponseError } from './api.interceptor';

export const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(onResponse, onResponseError);


export const uninterceptedAxiosInstance = axios.create({
  baseURL: config.API_URL,
});
uninterceptedAxiosInstance.interceptors.response.use(onResponse, onResponseError);

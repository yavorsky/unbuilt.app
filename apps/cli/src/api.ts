// Create an axios instance (typically in a separate file like api.js)
import axios from 'axios';
import { getBaseAPIUrl } from './constants';

const api = axios.create({
  baseURL: getBaseAPIUrl(), // Your base URL function
  headers: {
    'Content-Type': 'application/json',
    // Common headers for all requests
  },
});

// Add request interceptor if you need to include auth tokens on all requests
api.interceptors.request.use((config) => {
  // You can add dynamic headers here if needed
  if (process.env.UNBUILT_API_KEY) {
    config.headers['X-Analysis-Passcode'] = process.env.UNBUILT_API_KEY;
  }
  return config;
});

export default api;

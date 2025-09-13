import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// 🟢 Request Interceptor (додає токен + логування)
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔎 Логування кожного запиту
    console.log('🌐 [REQUEST]', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.log('❌ [REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// 🟢 Response Interceptor (логування відповідей)
api.interceptors.response.use(
  (response) => {
    console.log('✅ [RESPONSE]', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log('❌ [RESPONSE ERROR]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;

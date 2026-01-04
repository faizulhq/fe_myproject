import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  // PERBAIKAN: JANGAN set Content-Type default, biarkan Axios otomatis detect
});

// 1. REQUEST INTERCEPTOR: Pasang Token Otomatis
axiosClient.interceptors.request.use(
  (config) => {
    // Ambil token dari Cookie
    const token = Cookies.get('access_token');
    
    console.log('🔑 Token from Cookie:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.warn('⚠️ No access token found in cookies');
    }
    
    // PENTING: Jika data adalah FormData, HAPUS Content-Type agar browser set otomatis
    if (config.data instanceof FormData) {
      console.log('📦 Detected FormData - Removing Content-Type header');
      delete config.headers['Content-Type'];
    }
    
    console.log('📡 Request:', config.method.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// 2. RESPONSE INTERCEPTOR: Handle Error Global
axiosClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    
    // Jika 401 Unauthorized, logout otomatis
    if (error.response?.status === 401) {
      console.warn('🚨 401 Unauthorized - Logging out...');
      
      Cookies.remove('access_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      Cookies.remove('user', { path: '/' });
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
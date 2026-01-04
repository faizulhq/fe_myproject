import { useMutation } from '@tanstack/react-query';
import * as authAPI from '@/lib/api/auth';
import useAuthStore from '@/lib/store/authStore';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

// --- FUNGSI PENERJEMAH ERROR ---
const getErrorMessage = (error) => {
  const data = error.response?.data;
  
  if (!data) return 'Gagal terhubung ke server. Pastikan backend berjalan.';
  if (data.detail) return data.detail;

  const keys = Object.keys(data);
  if (keys.length > 0) {
    const fieldName = keys[0];
    const errorMsg = data[fieldName];
    
    if (Array.isArray(errorMsg)) {
      return `${fieldName}: ${errorMsg[0]}`; 
    }
    return `${fieldName}: ${errorMsg}`;
  }

  return 'Terjadi kesalahan yang tidak diketahui.';
};

export const useLogin = () => {
  const loginToStore = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      console.log('🎉 Login Success Response:', response.data);
      
      const { access, refresh, user } = response.data || {};
      
      // PERBAIKAN: Set cookie dengan options yang benar
      const cookieOptions = { 
        path: '/',
        sameSite: 'lax', // Penting untuk development
        secure: false // Set true di production dengan HTTPS
      };
      
      if (access) {
        Cookies.set('access_token', access, { ...cookieOptions, expires: 1 }); // 1 hari
        console.log('✅ Access token saved:', access.substring(0, 20) + '...');
      } else {
        console.error('❌ No access token in response!');
      }
      
      if (refresh) {
        Cookies.set('refresh_token', refresh, { ...cookieOptions, expires: 7 }); // 7 hari
        console.log('✅ Refresh token saved');
      }
      
      if (user) {
        Cookies.set('user', JSON.stringify(user), { ...cookieOptions, expires: 1 });
        loginToStore(user);
        console.log('✅ User data saved:', user);
      } else {
        console.error('❌ No user data in response!');
      }
      
      // Verifikasi token tersimpan
      const savedToken = Cookies.get('access_token');
      console.log('🔍 Verification - Token in cookie:', savedToken ? 'YES' : 'NO');

      message.success('Login berhasil');
      router.push('/');
    },
    onError: (error) => {
      console.error("LOGIN ERROR (Raw):", error.response?.data);
      message.error(getErrorMessage(error));
    }
  });
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      message.success('Registrasi berhasil! Silakan login.');
      router.push('/login');
    },
    onError: (error) => {
      console.error("REGISTER ERROR (Raw):", error.response?.data);
      message.error(getErrorMessage(error));
    }
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: () => {
      message.success('Profil berhasil diperbarui');
      window.location.reload(); 
    },
    onError: (error) => {
      console.error("UPDATE ERROR (Raw):", error.response?.data);
      message.error(getErrorMessage(error));
    },
  });
};
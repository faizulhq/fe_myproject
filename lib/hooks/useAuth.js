import { useMutation, useQuery } from '@tanstack/react-query';
import * as authAPI from '@/lib/api/auth';
import useAuthStore from '@/lib/store/authStore';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

export const useLogin = () => {
  const loginToStore = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { user, access, refresh } = response.data || {};
      
      // Simpan Token & User ke Cookie
      if (access) Cookies.set('access_token', access, { expires: 1 });
      if (refresh) Cookies.set('refresh_token', refresh, { expires: 7 });
      
      // Jika backend tidak kirim detail user saat login, kita ambil manual (opsional)
      // Tapi asumsi Anda backend mengirim user object seperti referensi lahan pintar:
      // Jika user null, sebaiknya panggil endpoint /profile lagi. 
      // Untuk amannya, kita panggil fetch profile di AdminLayout saja.
      
      message.success('Login berhasil');
      router.push('/');
    },
    onError: (error) => {
      message.error(error.response?.data?.detail || 'Login gagal');
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
      message.error(error.response?.data?.detail || 'Registrasi gagal');
    }
  });
};

// Hook untuk update profile
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: () => {
      message.success('Profil berhasil diperbarui');
      // Bisa tambahkan invalidateQueries di sini jika perlu
      window.location.reload(); 
    },
    onError: () => message.error('Gagal update profil'),
  });
};
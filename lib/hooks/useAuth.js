import { useMutation } from '@tanstack/react-query';
import * as authAPI from '@/lib/api/auth';
import useAuthStore from '@/lib/store/authStore';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

// --- FUNGSI BARU: PENERJEMAH ERROR ---
// Agar pesan asli dari Backend (seperti "Password tidak cocok" atau "Email invalid") muncul di layar
const getErrorMessage = (error) => {
  const data = error.response?.data;
  
  // 1. Jika server mati / tidak ada respon
  if (!data) return 'Gagal terhubung ke server. Pastikan backend berjalan.';

  // 2. Jika error umum (misal: salah password saat login)
  if (data.detail) return data.detail;

  // 3. Jika error validasi Form (misal: username kembar, password beda)
  // Backend mengirim: { "username": ["Sudah ada"], "password": ["Tidak cocok"] }
  const keys = Object.keys(data);
  if (keys.length > 0) {
    const fieldName = keys[0];        // Ambil nama field pertama yg error (misal: 'username')
    const errorMsg = data[fieldName]; // Ambil pesannya
    
    // Format pesan agar rapi: "username: Sudah digunakan"
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
      const { access, refresh, user } = response.data || {};
      
      if (access) Cookies.set('access_token', access, { expires: 1, path: '/' });
      if (refresh) Cookies.set('refresh_token', refresh, { expires: 7, path: '/' });
      if (user) Cookies.set('user', JSON.stringify(user), { expires: 1, path: '/' });
      
      if (user) loginToStore(user);

      message.success('Login berhasil');
      router.push('/');
    },
    onError: (error) => {
      console.error("LOGIN ERROR (Raw):", error.response?.data); // Cek Console browser jika penasaran
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
      console.error("REGISTER ERROR (Raw):", error.response?.data); // Cek Console browser jika penasaran
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
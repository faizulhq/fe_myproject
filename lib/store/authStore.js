import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // Login: Simpan ke state
  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
  },

  // Logout: Hapus state
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Initialize: Baca dari Cookie saat refresh halaman
  initializeAuth: () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        set({ user: parsedUser, isAuthenticated: true });
      } catch (e) {
        console.error("Gagal parsing cookie user", e);
        Cookies.remove('user');
      }
    } else {
      set({ user: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
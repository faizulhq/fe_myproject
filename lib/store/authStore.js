import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    // Hapus dengan path '/'
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    set({ user: null, isAuthenticated: false });
    
    // Redirect via window location agar bersih
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  initializeAuth: () => {
    const userCookie = Cookies.get('user');
    const tokenCookie = Cookies.get('access_token');

    if (tokenCookie && userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        set({ user: parsedUser, isAuthenticated: true });
      } catch (e) {
        Cookies.remove('user', { path: '/' });
        set({ user: null, isAuthenticated: false });
      }
    } else {
      set({ user: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
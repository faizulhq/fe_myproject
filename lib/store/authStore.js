import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userData) => {
    console.log('🔐 Store: Login called with user:', userData);
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    console.log('🚪 Store: Logout called');
    
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
    console.log('🔄 Store: Initializing auth...');
    
    const userCookie = Cookies.get('user');
    const tokenCookie = Cookies.get('access_token');

    console.log('🔍 Token exists:', !!tokenCookie);
    console.log('🔍 User exists:', !!userCookie);

    if (tokenCookie && userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        console.log('✅ Auth initialized with user:', parsedUser.username);
        set({ user: parsedUser, isAuthenticated: true });
      } catch (e) {
        console.error('❌ Failed to parse user cookie:', e);
        Cookies.remove('user', { path: '/' });
        set({ user: null, isAuthenticated: false });
      }
    } else {
      console.log('⚠️ No valid auth cookies found');
      set({ user: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
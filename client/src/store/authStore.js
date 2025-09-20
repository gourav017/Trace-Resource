import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ loading }),

      initialize: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          set({ loading: true });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          
          if (response.data.success) {
            set({
              user: response.data.data,
              token,
              isAuthenticated: true,
              loading: false
            });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          set({ user: null, token: null, isAuthenticated: false, loading: false });
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

useAuthStore.getState().initialize();

export { useAuthStore };
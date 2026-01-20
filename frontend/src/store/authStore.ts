// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { api } from '../services/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (code: string) => {
        try {
          const response = await api.post('/auth/verify-code', { code });
          const { access_token, user } = response.data;
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false
          });
          
          // Установить токен для последующих запросов
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        delete api.defaults.headers.common['Authorization'];
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
          delete api.defaults.headers.common['Authorization'];
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);

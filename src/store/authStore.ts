import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/src/types';
import { authService } from '@/src/services/authService';
import { logger } from '@/src/utils/logger';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (user) => set({ 
        user, 
        isAuthenticated: true,
        isLoading: false,
        error: null
      }),
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },
      initializeAuth: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (error) {
          logger.warn('Failed to bootstrap auth session', { error });
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          state.error = null;
        }
      },
    }
  )
);

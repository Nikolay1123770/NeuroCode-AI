// frontend/src/components/Auth/AuthProvider.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

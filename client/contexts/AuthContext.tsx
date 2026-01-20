// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  apiKey: string;
  plan: 'free' | 'pro' | 'enterprise';
  requestsToday: number;
  requestsLimit: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (telegramData: TelegramAuthData) => Promise<void>;
  logout: () => void;
  refreshApiKey: () => Promise<string>;
}

interface TelegramAuthData {
  id: string;
  username: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Загрузка сохранённой сессии при старте
  useEffect(() => {
    const savedUser = localStorage.getItem('neurocode_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('neurocode_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Сохранение сессии при изменении
  useEffect(() => {
    if (user) {
      localStorage.setItem('neurocode_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('neurocode_user');
    }
  }, [user]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'nc_';
    for (let i = 0; i < 48; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const login = async (telegramData: TelegramAuthData) => {
    // Имитация запроса к серверу
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: `user_${telegramData.id}`,
      telegramId: telegramData.id,
      username: telegramData.username || `user${telegramData.id}`,
      firstName: telegramData.first_name,
      lastName: telegramData.last_name,
      photoUrl: telegramData.photo_url,
      apiKey: generateApiKey(),
      plan: 'free',
      requestsToday: 0,
      requestsLimit: 1000,
    };

    setUser(newUser);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  const refreshApiKey = async () => {
    if (!user) throw new Error('Not authenticated');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const newKey = generateApiKey();
    
    setUser(prev => prev ? { ...prev, apiKey: newKey } : null);
    return newKey;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        refreshApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

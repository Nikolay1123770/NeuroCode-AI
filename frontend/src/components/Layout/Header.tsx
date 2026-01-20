// frontend/src/components/Layout/Header.tsx
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Menu, Settings, Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'NeuroCode-AI', onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-400" />
        </button>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </header>
  );
};

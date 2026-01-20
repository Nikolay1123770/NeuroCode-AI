// frontend/src/components/Layout/Sidebar.tsx (полная версия)
import React, { useState, useEffect } from 'react';
import { chatApi } from '../../services/api';
import { ChatSession } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  LogOut, 
  Settings,
  ChevronLeft,
  Menu,
  Code,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentSessionId: number | null;
  onSelectSession: (sessionId: number) => void;
  onNewSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSessionId,
  onSelectSession,
  onNewSession
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const response = await chatApi.getSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chatApi.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        onNewSession();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await chatApi.createSession();
      setSessions((prev) => [response.data, ...prev]);
      onSelectSession(response.data.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-900 border-r border-gray-700 flex flex-col">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-4 hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-400" />
        </button>
        <button
          onClick={handleNewSession}
          className="p-4 hover:bg-gray-800 transition-colors"
          title="Новый чат"
        >
          <Plus className="w-6 h-6 text-blue-400" />
        </button>
        <div className="flex-1" />
        <button
          onClick={logout}
          className="p-4 hover:bg-gray-800 transition-colors"
          title="Выйти"
        >
          <LogOut className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">NeuroCode</h1>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewSession}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Новый чат</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">
          История чатов
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет сохранённых чатов</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate text-sm">{session.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
          <div className="flex items-center space-x-3">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.first_name?.[0] || user?.username?.[0] || '?'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.first_name || user?.username || 'Пользователь'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                @{user?.username || 'unknown'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Выйти"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

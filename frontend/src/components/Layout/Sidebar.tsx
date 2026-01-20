// frontend/src/components/Layout/Sidebar.tsx
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
  Menu
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
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await chatApi.getSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
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
          <Plus className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border

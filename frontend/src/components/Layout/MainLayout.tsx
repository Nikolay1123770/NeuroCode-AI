// frontend/src/components/Layout/MainLayout.tsx
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatWindow } from '../Chat/ChatWindow';

export const MainLayout: React.FC = () => {
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNewSession = () => {
    setCurrentSessionId(null);
  };

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar
          currentSessionId={currentSessionId}
          onSelectSession={setCurrentSessionId}
          onNewSession={handleNewSession}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={currentSessionId ? 'Чат с NeuroCode' : 'Новый чат'}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-hidden">
          {currentSessionId ? (
            <ChatWindow sessionId={currentSessionId} />
          ) : (
            <WelcomeScreen onStartChat={(sessionId) => setCurrentSessionId(sessionId)} />
          )}
        </main>
      </div>
    </div>
  );
};

// Welcome Screen Component
interface WelcomeScreenProps {
  onStartChat: (sessionId: number) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const [isCreating, setIsCreating] = useState(false);
  
  const suggestions = [
    { icon: '🔍', title: 'Анализ кода', prompt: 'Проанализируй этот код и найди проблемы' },
    { icon: '🐛', title: 'Исправить ошибку', prompt: 'Помоги исправить ошибку в коде' },
    { icon: '📝', title: 'Написать код', prompt: 'Напиши функцию для...' },
    { icon: '💡', title: 'Объяснить концепцию', prompt: 'Объясни как работает...' },
  ];

  const handleSuggestionClick = async (prompt: string) => {
    setIsCreating(true);
    try {
      const response = await chatApi.createSession(prompt.slice(0, 50));
      onStartChat(response.data.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <span className="text-5xl">🧠</span>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Привет! Я NeuroCode-AI
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Ваш ИИ-помощник для разработки. Чем могу помочь?
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
              disabled={isCreating}
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left transition-all group disabled:opacity-50"
            >
              <div className="text-2xl mb-2">{suggestion.icon}</div>
              <h3 className="text-white font-medium mb-1">{suggestion.title}</h3>
              <p className="text-sm text-gray-400">{suggestion.prompt}</p>
            </button>
          ))}
        </div>

        <div className="text-gray-500 text-sm">
          Или просто начните печатать в поле ввода ниже
        </div>
      </div>
    </div>
  );
};

import { chatApi } from '../../services/api';

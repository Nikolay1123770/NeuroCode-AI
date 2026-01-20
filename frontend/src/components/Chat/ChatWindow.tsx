// frontend/src/components/Chat/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../../services/api';
import { Message } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Send, Loader2 } from 'lucide-react';

interface ChatWindowProps {
  sessionId: number;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const response = await chatApi.getMessages(sessionId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;

    // Добавить сообщение пользователя сразу
    const tempUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      content,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    setIsSending(true);

    try {
      const response = await chatApi.sendMessage(sessionId, content);
      const { user_message, assistant_message } = response.data;

      // Заменить временное сообщение на реальное и добавить ответ
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id),
        user_message,
        assistant_message
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Удалить временное сообщение при ошибке
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      
      {isSending && (
        <div className="px-4 py-2 bg-gray-800/50">
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">NeuroCode думает...</span>
          </div>
        </div>
      )}
      
      <MessageInput onSend={handleSendMessage} disabled={isSending} />
    </div>
  );
};

// frontend/src/components/Auth/TelegramLogin.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MessageCircle, ArrowRight, Loader2 } from 'lucide-react';

export const TelegramLogin: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(code.toUpperCase().trim());
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Неверный или истёкший код');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 8) {
      setCode(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NeuroCode-AI</h1>
          <p className="text-gray-400">ИИ-помощник для разработчиков</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Вход через Telegram
          </h2>

          {/* Instructions */}
          <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">Как получить код:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Откройте <a 
                    href="https://t.me/NeuroCodeAI_bot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    @NeuroCodeAI_bot
                  </a></li>
                  <li>Нажмите /login или кнопку "Получить код"</li>
                  <li>Введите код ниже</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Код авторизации
              </label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="XXXXXXXX"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={8}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={code.length !== 8 || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Войти</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Telegram Button */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <a
              href="https://t.me/NeuroCodeAI_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#2AABEE] text-white font-medium rounded-xl hover:bg-[#229ED9] transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
              </svg>
              <span>Открыть Telegram бота</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Нажимая "Войти", вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
};

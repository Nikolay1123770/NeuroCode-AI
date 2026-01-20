// components/AuthModal.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

type AuthStep = 'start' | 'code' | 'loading' | 'success';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [step, setStep] = useState<AuthStep>('start');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  // Сброс состояния при открытии
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('start');
      setCode('');
      setError('');
      // Генерируем код для демо
      setGeneratedCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  }, [isAuthModalOpen]);

  const handleStartAuth = () => {
    // Открываем бота в новом окне
    window.open(`https://t.me/NeuroCodeAI_bot?start=auth_${generatedCode}`, '_blank');
    setStep('code');
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Код должен содержать 6 символов');
      return;
    }

    setStep('loading');
    setError('');

    try {
      // Имитация проверки кода (в реальности - запрос к API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Для демо принимаем любой код или сгенерированный
      const mockTelegramData = {
        id: Date.now().toString(),
        username: 'demo_user',
        first_name: 'Демо',
        last_name: 'Пользователь',
        photo_url: undefined,
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'demo_hash',
      };

      await login(mockTelegramData);
      setStep('success');
    } catch (err) {
      setError('Неверный код. Попробуйте снова.');
      setStep('code');
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            {step === 'success' ? 'Успешно!' : 'Вход через Telegram'}
          </h2>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'start' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <p className="text-gray-400">
                  Для входа используйте наш Telegram бот. 
                  Это безопасно и занимает несколько секунд.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm text-gray-300">Нажмите кнопку ниже, чтобы открыть бота</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm text-gray-300">Нажмите "Start" в боте</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm text-gray-300">Скопируйте код и введите его здесь</p>
                </div>
              </div>

              <button
                onClick={handleStartAuth}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Открыть Telegram бота
              </button>

              {/* Демо режим */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Демо режим: введите любой 6-значный код</p>
                <button
                  onClick={() => setStep('code')}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Уже есть код? Ввести вручную
                </button>
              </div>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-400 mb-2">
                  Введите 6-значный код из бота
                </p>
                {generatedCode && (
                  <p className="text-xs text-gray-500">
                    Демо код: <span className="text-purple-400 font-mono">{generatedCode}</span>
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                    setCode(value);
                    setError('');
                  }}
                  placeholder="XXXXXX"
                  className={cn(
                    "w-full px-4 py-4 text-center text-2xl font-mono tracking-widest rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none transition-colors",
                    error ? "border-red-500/50" : "border-white/10 focus:border-purple-500/50"
                  )}
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('start')}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={code.length !== 6}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          )}

          {step === 'loading' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
              <p className="text-gray-400">Проверяем код...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Добро пожаловать!</h3>
                <p className="text-gray-400">Вы успешно вошли в аккаунт</p>
              </div>
              <button
                onClick={closeAuthModal}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Начать работу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
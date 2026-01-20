// components/UserProfile.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export function UserProfile() {
  const { user, logout, refreshApiKey } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshKey = async () => {
    setIsRefreshing(true);
    try {
      await refreshApiKey();
    } finally {
      setIsRefreshing(false);
    }
  };

  const maskedApiKey = showApiKey 
    ? user.apiKey 
    : `${user.apiKey.slice(0, 6)}${'•'.repeat(20)}${user.apiKey.slice(-4)}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
          {user.firstName[0]}
        </div>
        <span className="hidden sm:block text-sm text-white">{user.firstName}</span>
        <svg className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 rounded-xl border border-purple-500/20 shadow-xl overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-medium">
                {user.firstName[0]}
              </div>
              <div>
                <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-gray-400">@{user.username}</div>
              </div>
            </div>
          </div>

          {/* Plan & Usage */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Тариф</span>
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                user.plan === 'free' && "bg-gray-500/20 text-gray-300",
                user.plan === 'pro' && "bg-purple-500/20 text-purple-300",
                user.plan === 'enterprise' && "bg-yellow-500/20 text-yellow-300"
              )}>
                {user.plan === 'free' && 'Бесплатный'}
                {user.plan === 'pro' && 'Pro'}
                {user.plan === 'enterprise' && 'Enterprise'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Запросов сегодня</span>
                <span className="text-white">{user.requestsToday} / {user.requestsLimit}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${(user.requestsToday / user.requestsLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* API Key */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">API Key</span>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                {showApiKey ? 'Скрыть' : 'Показать'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-xs text-gray-300 font-mono truncate">
                {maskedApiKey}
              </code>
              <button
                onClick={copyApiKey}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Копировать"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={handleRefreshKey}
              disabled={isRefreshing}
              className="mt-2 w-full py-2 rounded-lg bg-white/5 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className={cn("w-4 h-4", isRefreshing && "animate-spin")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Сгенерировать новый ключ
            </button>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
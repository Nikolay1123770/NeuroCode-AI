import { useState } from 'react';
import { cn } from '@/utils/cn';

export function ApiDocs() {
  const [activeTab, setActiveTab] = useState<'overview' | 'auth' | 'endpoints' | 'models'>('overview');

  return (
    <section className="py-8 min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            API Документация
          </h1>
          <p className="text-gray-400 text-lg">
            Всё что нужно для интеграции NeuroCode AI в ваши проекты
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'overview', label: 'Обзор' },
            { id: 'auth', label: 'Авторизация' },
            { id: 'endpoints', label: 'Endpoints' },
            { id: 'models', label: 'Модели' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Быстрый старт</h2>
              <p className="text-gray-400">
                NeuroCode AI API позволяет интегрировать возможности искусственного интеллекта 
                в любые ваши приложения. API совместим с форматом OpenAI, что упрощает миграцию.
              </p>

              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-2">Базовый URL</div>
                <code className="text-purple-400">https://api.neurocode.ai/v1</code>
              </div>

              <h3 className="text-xl font-semibold text-white mt-8">Пример запроса</h3>
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 flex items-center justify-between">
                  <span>cURL</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`curl -X POST https://api.neurocode.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "neurocode-1",
    "messages": [
      {"role": "system", "content": "Ты полезный ассистент."},
      {"role": "user", "content": "Привет! Как дела?"}
    ],
    "temperature": 0.7
  }'`)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Копировать
                  </button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-green-400">{`curl -X POST https://api.neurocode.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "neurocode-1",
    "messages": [
      {"role": "system", "content": "Ты полезный ассистент."},
      {"role": "user", "content": "Привет! Как дела?"}
    ],
    "temperature": 0.7
  }'`}</code>
                </pre>
              </div>

              <h3 className="text-xl font-semibold text-white mt-8">Ответ</h3>
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400">
                  <span>JSON</span>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-green-400">{`{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1699876543,
  "model": "neurocode-1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Привет! У меня всё отлично, спасибо! Чем могу помочь?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 18,
    "total_tokens": 43
  }
}`}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Авторизация</h2>
              <p className="text-gray-400">
                Все запросы к API должны включать заголовок авторизации с вашим API ключом.
              </p>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <div className="font-medium text-yellow-400">Важно</div>
                    <div className="text-sm text-yellow-300/70 mt-1">
                      Никогда не раскрывайте ваш API ключ в клиентском коде. Используйте 
                      серверную часть для запросов к API.
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white">Формат заголовка</h3>
              <div className="bg-gray-900 rounded-xl p-4">
                <code className="text-purple-400">Authorization: Bearer YOUR_API_KEY</code>
              </div>

              <h3 className="text-xl font-semibold text-white mt-8">Получение API ключа</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-400">
                <li>Нажмите кнопку "Получить API Key" в шапке сайта</li>
                <li>Зарегистрируйтесь или войдите в аккаунт</li>
                <li>Перейдите в раздел "API Keys"</li>
                <li>Создайте новый ключ и скопируйте его</li>
              </ol>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mt-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-purple-400">Бесплатный план</div>
                    <div className="text-sm text-purple-300/70 mt-1">
                      Включает 1000 запросов в день, до 4000 токенов на запрос и доступ ко всем моделям.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Endpoints</h2>

              {/* Chat Completions */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-white/5 flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono">POST</span>
                  <code className="text-white">/v1/chat/completions</code>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-gray-400">Создаёт ответ на основе диалога.</p>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Параметры</h4>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-white/10">
                        <tr>
                          <td className="py-2 text-purple-400 font-mono">model</td>
                          <td className="py-2 text-gray-500">string</td>
                          <td className="py-2 text-gray-400">ID модели для использования</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-purple-400 font-mono">messages</td>
                          <td className="py-2 text-gray-500">array</td>
                          <td className="py-2 text-gray-400">Массив сообщений диалога</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-purple-400 font-mono">temperature</td>
                          <td className="py-2 text-gray-500">number</td>
                          <td className="py-2 text-gray-400">Креативность (0-2, по умолчанию 0.7)</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-purple-400 font-mono">max_tokens</td>
                          <td className="py-2 text-gray-500">integer</td>
                          <td className="py-2 text-gray-400">Максимум токенов в ответе</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-purple-400 font-mono">stream</td>
                          <td className="py-2 text-gray-500">boolean</td>
                          <td className="py-2 text-gray-400">Потоковая передача ответа</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Models */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-white/5 flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">GET</span>
                  <code className="text-white">/v1/models</code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400">Возвращает список доступных моделей.</p>
                </div>
              </div>

              {/* Embeddings */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-white/5 flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono">POST</span>
                  <code className="text-white">/v1/embeddings</code>
                </div>
                <div className="p-4">
                  <p className="text-gray-400">Создаёт векторные представления текста для поиска и анализа.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Доступные модели</h2>
              <p className="text-gray-400">
                Выберите модель в зависимости от ваших задач.
              </p>

              <div className="grid gap-4">
                {[
                  {
                    id: 'neurocode-1',
                    name: 'NeuroCode-1',
                    description: 'Основная модель. Лучший баланс качества и скорости для большинства задач.',
                    context: '128K токенов',
                    speed: 'Средняя',
                    best: 'Универсальные задачи',
                  },
                  {
                    id: 'neurocode-code',
                    name: 'NeuroCode-Code',
                    description: 'Оптимизирована для генерации и анализа кода. Поддерживает 50+ языков.',
                    context: '64K токенов',
                    speed: 'Средняя',
                    best: 'Программирование',
                  },
                  {
                    id: 'neurocode-fast',
                    name: 'NeuroCode-Fast',
                    description: 'Быстрая модель для простых задач. Идеальна для чат-ботов.',
                    context: '32K токенов',
                    speed: 'Высокая',
                    best: 'Чат-боты, простые задачи',
                  },
                  {
                    id: 'neurocode-vision',
                    name: 'NeuroCode-Vision',
                    description: 'Поддерживает анализ изображений. Понимает и описывает картинки.',
                    context: '64K токенов',
                    speed: 'Низкая',
                    best: 'Работа с изображениями',
                  },
                ].map((model) => (
                  <div key={model.id} className="border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                        <code className="text-sm text-purple-400">{model.id}</code>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{model.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Контекст:</span>
                        <span className="text-white ml-1">{model.context}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Скорость:</span>
                        <span className="text-white ml-1">{model.speed}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Лучше для:</span>
                        <span className="text-white ml-1">{model.best}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

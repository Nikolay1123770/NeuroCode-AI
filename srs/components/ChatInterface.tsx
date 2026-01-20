import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я NeuroCode AI - ваш помощник в разработке. Я могу помочь вам создать:\n\n• Telegram ботов\n• Веб-сайты и приложения\n• API интеграции\n• Скрипты и автоматизации\n\nЧто бы вы хотели создать сегодня?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('telegram') || lowerMessage.includes('бот')) {
      return `# Telegram Бот на Python

Вот пример простого Telegram бота:

\`\`\`python
import telebot
import requests

BOT_TOKEN = "YOUR_BOT_TOKEN"
API_URL = "https://api.neurocode.ai/v1/chat"
API_KEY = "YOUR_API_KEY"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(func=lambda message: True)
def handle_message(message):
    response = requests.post(
        API_URL,
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={
            "model": "neurocode-1",
            "messages": [
                {"role": "user", "content": message.text}
            ]
        }
    )
    
    ai_response = response.json()["choices"][0]["message"]["content"]
    bot.reply_to(message, ai_response)

if __name__ == "__main__":
    bot.polling(none_stop=True)
\`\`\`

Установите зависимости: \`pip install pyTelegramBotAPI requests\`

Нужна помощь с настройкой?`;
    }
    
    if (lowerMessage.includes('сайт') || lowerMessage.includes('html') || lowerMessage.includes('react')) {
      return `# React Компонент с AI Чатом

Вот пример React компонента:

\`\`\`tsx
import { useState } from 'react';

export function AIChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const response = await fetch('https://api.neurocode.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        model: 'neurocode-1',
        messages: [...messages, { role: 'user', content: input }]
      })
    });
    
    const data = await response.json();
    setMessages([...messages, 
      { role: 'user', content: input },
      { role: 'assistant', content: data.choices[0].message.content }
    ]);
    setInput('');
  };

  return (
    <div className="chat-container">
      {/* Ваш UI */}
    </div>
  );
}
\`\`\`

Хотите более детальный пример?`;
    }
    
    if (lowerMessage.includes('api') || lowerMessage.includes('интеграц')) {
      return `# API Интеграция

## Базовый запрос

\`\`\`bash
curl -X POST https://api.neurocode.ai/v1/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "neurocode-1",
    "messages": [
      {"role": "user", "content": "Привет!"}
    ]
  }'
\`\`\`

## Доступные модели:
- \`neurocode-1\` - Основная модель
- \`neurocode-code\` - Оптимизирована для кода
- \`neurocode-fast\` - Быстрые ответы

## Лимиты бесплатного плана:
- 1000 запросов в день
- До 4000 токенов на запрос
- Доступ ко всем моделям

Нужен API ключ? Нажмите "Получить API Key" в шапке сайта!`;
    }
    
    return `Отличный вопрос! Я могу помочь вам с:

1. **Генерацией кода** - напишу код на любом языке
2. **Telegram ботами** - создам бота с AI функциями
3. **Веб-разработкой** - React, Vue, HTML/CSS
4. **API интеграцией** - покажу примеры использования

Просто опишите, что вы хотите создать, и я предоставлю готовый код!

Например, спросите:
- "Создай Telegram бота"
- "Покажи пример React компонента"
- "Как использовать API?"`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateResponse(input),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const quickActions = [
    'Создай Telegram бота',
    'Покажи пример React',
    'Как использовать API?',
    'Сгенерируй HTML страницу',
  ];

  return (
    <section className="py-8 min-h-[calc(100vh-200px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden backdrop-blur-xl">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-medium">NeuroCode AI</span>
            <span className="text-gray-500 text-sm">• Онлайн</span>
          </div>

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-gray-200'
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content.split('```').map((part, index) => {
                      if (index % 2 === 1) {
                        const [lang, ...code] = part.split('\n');
                        return (
                          <div key={index} className="my-3">
                            <div className="bg-gray-900 rounded-lg overflow-hidden">
                              <div className="px-3 py-1 bg-gray-800 text-xs text-gray-400 flex items-center justify-between">
                                <span>{lang || 'code'}</span>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(code.join('\n'))}
                                  className="text-purple-400 hover:text-purple-300"
                                >
                                  Копировать
                                </button>
                              </div>
                              <pre className="p-3 text-xs overflow-x-auto">
                                <code className="text-green-400">{code.join('\n')}</code>
                              </pre>
                            </div>
                          </div>
                        );
                      }
                      return <span key={index}>{part}</span>;
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

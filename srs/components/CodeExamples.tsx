import { useState } from 'react';
import { cn } from '@/utils/cn';

const examples = {
  python: {
    label: 'Python',
    code: `import requests

API_KEY = "YOUR_API_KEY"
API_URL = "https://api.neurocode.ai/v1/chat/completions"

def chat(message: str) -> str:
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        json={
            "model": "neurocode-1",
            "messages": [
                {"role": "user", "content": message}
            ]
        }
    )
    
    return response.json()["choices"][0]["message"]["content"]

# Пример использования
result = chat("Напиши функцию сортировки на Python")
print(result)`,
  },
  javascript: {
    label: 'JavaScript',
    code: `const API_KEY = "YOUR_API_KEY";
const API_URL = "https://api.neurocode.ai/v1/chat/completions";

async function chat(message) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${API_KEY}\`
    },
    body: JSON.stringify({
      model: "neurocode-1",
      messages: [
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Пример использования
chat("Напиши функцию сортировки на JavaScript")
  .then(result => console.log(result));`,
  },
  telegram: {
    label: 'Telegram Bot',
    code: `import telebot
import requests

BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"
API_KEY = "YOUR_API_KEY"
API_URL = "https://api.neurocode.ai/v1/chat/completions"

bot = telebot.TeleBot(BOT_TOKEN)

# Хранение истории диалогов
conversations = {}

@bot.message_handler(commands=['start'])
def start(message):
    conversations[message.chat.id] = []
    bot.reply_to(message, "Привет! Я AI бот. Напиши мне что-нибудь!")

@bot.message_handler(commands=['clear'])
def clear(message):
    conversations[message.chat.id] = []
    bot.reply_to(message, "История очищена!")

@bot.message_handler(func=lambda m: True)
def handle_message(message):
    chat_id = message.chat.id
    
    if chat_id not in conversations:
        conversations[chat_id] = []
    
    # Добавляем сообщение пользователя
    conversations[chat_id].append({
        "role": "user",
        "content": message.text
    })
    
    # Отправляем запрос к API
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        json={
            "model": "neurocode-1",
            "messages": conversations[chat_id]
        }
    )
    
    ai_response = response.json()["choices"][0]["message"]["content"]
    
    # Сохраняем ответ в историю
    conversations[chat_id].append({
        "role": "assistant",
        "content": ai_response
    })
    
    bot.reply_to(message, ai_response)

if __name__ == "__main__":
    print("Бот запущен!")
    bot.polling(none_stop=True)`,
  },
  react: {
    label: 'React',
    code: `import { useState } from 'react';

const API_KEY = "YOUR_API_KEY";
const API_URL = "https://api.neurocode.ai/v1/chat/completions";

export function AIChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${API_KEY}\`
        },
        body: JSON.stringify({
          model: 'neurocode-1',
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={\`message \${msg.role}\`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="loading">Печатает...</div>}
      </div>
      
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Отправить
        </button>
      </div>
    </div>
  );
}`,
  },
  nodejs: {
    label: 'Node.js',
    code: `const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_API_KEY";
const API_URL = "https://api.neurocode.ai/v1/chat/completions";

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${API_KEY}\`
      },
      body: JSON.stringify({
        model: 'neurocode-1',
        messages: [
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    res.json({
      success: true,
      response: data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Сервер запущен на порту \${PORT}\`);
});`,
  },
};

export function CodeExamples() {
  const [activeExample, setActiveExample] = useState<keyof typeof examples>('python');

  const copyCode = () => {
    navigator.clipboard.writeText(examples[activeExample].code);
  };

  return (
    <section className="py-8 min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Примеры кода
          </h1>
          <p className="text-gray-400 text-lg">
            Готовые примеры интеграции для разных платформ и языков
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden backdrop-blur-xl">
          {/* Language tabs */}
          <div className="flex flex-wrap border-b border-white/10">
            {Object.entries(examples).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveExample(key as keyof typeof examples)}
                className={cn(
                  'px-4 sm:px-6 py-3 text-sm font-medium transition-colors',
                  activeExample === key
                    ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {value.label}
              </button>
            ))}
          </div>

          {/* Code */}
          <div className="relative">
            <button
              onClick={copyCode}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors z-10"
            >
              Копировать
            </button>
            <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
              <code className="text-green-400">{examples[activeExample].code}</code>
            </pre>
          </div>
        </div>

        {/* Additional info cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Просто скопируйте</h3>
            <p className="text-gray-400 text-sm">
              Замените YOUR_API_KEY на ваш ключ и код готов к использованию.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">OpenAI совместимость</h3>
            <p className="text-gray-400 text-sm">
              API совместим с OpenAI SDK. Просто замените base_url.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Подробная документация</h3>
            <p className="text-gray-400 text-sm">
              Полная документация с примерами для всех endpoints.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

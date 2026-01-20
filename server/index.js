const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { setupBot, sendMessage } = require('./bot');
const authRoutes = require('./auth');
const { db, saveDB } = require('./database');

// ═══════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ═══════════════════════════════════════════════════════════
const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'https://neurocodeai.bothost.ru';
const WEBHOOK_PATH = `/webhook/${BOT_TOKEN}`;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ═══════════════════════════════════════════════════════════
// СТАТИЧЕСКИЕ ФАЙЛЫ (React build)
// ═══════════════════════════════════════════════════════════
app.use(express.static(path.join(__dirname, '../client/dist')));

// ═══════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        users: db.users.length,
        timestamp: new Date().toISOString()
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User API
app.get('/api/user/:telegramId', (req, res) => {
    const user = db.users.find(u => u.telegramId === req.params.telegramId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { ...safeUser } = user;
    res.json(safeUser);
});

// Refresh API key
app.post('/api/user/:telegramId/refresh-key', (req, res) => {
    const user = db.users.find(u => u.telegramId === req.params.telegramId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const newKey = generateApiKey();
    user.apiKey = newKey;
    saveDB();
    
    res.json({ apiKey: newKey });
});

// Chat API (mock)
app.post('/api/chat/completions', (req, res) => {
    // Здесь можно интегрировать реальный AI API
    const { messages } = req.body;
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    res.json({
        id: 'chat-' + Date.now(),
        choices: [{
            message: {
                role: 'assistant',
                content: `Это демо-ответ на: "${lastMessage}"\n\nВ продакшене здесь будет настоящий AI.`
            }
        }],
        usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30
        }
    });
});

// ═══════════════════════════════════════════════════════════
// TELEGRAM WEBHOOK
// ═══════════════════════════════════════════════════════════
app.post(WEBHOOK_PATH, async (req, res) => {
    const { message, callback_query } = req.body;
    
    if (callback_query) {
        await handleCallback(callback_query);
        return res.sendStatus(200);
    }
    
    if (message) {
        await handleMessage(message);
        return res.sendStatus(200);
    }
    
    res.sendStatus(200);
});

async function handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;
    const from = message.from;
    
    if (text === '/start') {
        const user = db.users.find(u => u.telegramId === from.id);
        
        await sendMessage(chatId, 
            `🚀 <b>NeuroCode AI</b>\n\n` +
            `Привет, ${from.first_name}! 👋\n\n` +
            `Платформа для создания с помощью AI:\n` +
            `✨ Генерация кода\n` +
            `🤖 Telegram боты\n` +
            `🌐 Веб-приложения\n\n` +
            (user ? 
                `💎 Твой баланс: ${user.requestsToday}/${user.requestsLimit} запросов\n\n` :
                `🎁 Бесплатный тариф: 1000 запросов/день\n\n`
            ) +
            `Нажми на кнопку ниже! 👇`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🌐 Открыть платформу', url: DOMAIN }],
                        [
                            { text: user ? '👤 Мой профиль' : '🔐 Войти', callback_data: 'auth' },
                            { text: '📖 Документация', url: `${DOMAIN}/#api` }
                        ],
                        [
                            { text: '💻 Примеры кода', url: `${DOMAIN}/#examples` },
                            { text: '💬 AI Чат', url: `${DOMAIN}/#chat` }
                        ]
                    ]
                }
            }
        );
    }
    
    if (text === '/auth') {
        const code = generateAuthCode();
        
        db.authCodes.set(code, {
            telegramId: from.id,
            username: from.username || `user${from.id}`,
            firstName: from.first_name,
            lastName: from.last_name,
            createdAt: Date.now()
        });
        
        setTimeout(() => db.authCodes.delete(code), 10 * 60 * 1000);
        
        await sendMessage(chatId,
            `🔐 <b>Код для входа</b>\n\n` +
            `<pre>${code}</pre>\n\n` +
            `⏰ Действителен 10 минут\n\n` +
            `<b>Как использовать:</b>\n` +
            `1. Открой сайт NeuroCode AI\n` +
            `2. Нажми "Войти через Telegram"\n` +
            `3. Введи этот код\n\n` +
            `<i>Нажми на код для копирования</i>`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🌐 Открыть сайт', url: DOMAIN }]
                    ]
                }
            }
        );
    }
    
    if (text === '/profile') {
        const user = db.users.find(u => u.telegramId === from.id);
        
        if (!user) {
            await sendMessage(chatId,
                `❌ <b>Не авторизован</b>\n\n` +
                `Используй /auth для получения кода`,
                {
                    reply_markup: {
                        inline_keyboard: [[{ text: '🔐 Получить код', callback_data: 'auth' }]]
                    }
                }
            );
            return;
        }
        
        await sendMessage(chatId,
            `👤 <b>Твой профиль</b>\n\n` +
            `<b>Имя:</b> ${user.firstName}\n` +
            `<b>Username:</b> @${user.username}\n` +
            `<b>Тариф:</b> ${user.plan.toUpperCase()}\n\n` +
            `📊 <b>Статистика:</b>\n` +
            `• Запросов сегодня: ${user.requestsToday}/${user.requestsLimit}\n` +
            `• Всего запросов: ${user.totalRequests || 0}\n\n` +
            `🔑 <b>API Key:</b>\n` +
            `<code>${user.apiKey.slice(0, 10)}...${user.apiKey.slice(-6)}</code>\n\n` +
            `<i>Полный ключ доступен на сайте</i>`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🌐 Открыть профиль', url: DOMAIN }],
                        [{ text: '🔄 Обновить ключ', callback_data: 'refresh_key' }]
                    ]
                }
            }
        );
    }
}

async function handleCallback(callback) {
    const chatId = callback.message.chat.id;
    const data = callback.data;
    const from = callback.from;
    
    if (data === 'auth') {
        const code = generateAuthCode();
        
        db.authCodes.set(code, {
            telegramId: from.id,
            username: from.username || `user${from.id}`,
            firstName: from.first_name,
            lastName: from.last_name,
            createdAt: Date.now()
        });
        
        setTimeout(() => db.authCodes.delete(code), 10 * 60 * 1000);
        
        await sendMessage(chatId,
            `🔐 <b>Код для входа</b>\n\n<pre>${code}</pre>\n\n⏰ Действителен 10 минут`,
            {
                reply_markup: {
                    inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]]
                }
            }
        );
    }
    
    if (data === 'refresh_key') {
        const user = db.users.find(u => u.telegramId === from.id);
        
        if (user) {
            const newKey = generateApiKey();
            user.apiKey = newKey;
            saveDB();
            
            await sendMessage(chatId,
                `✅ <b>API ключ обновлен!</b>\n\n` +
                `<code>${newKey.slice(0, 10)}...${newKey.slice(-6)}</code>\n\n` +
                `<i>Полный ключ в профиле на сайте</i>`
            );
        }
    }
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function generateAuthCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'nc_';
    for (let i = 0; i < 48; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// ═══════════════════════════════════════════════════════════
// SPA FALLBACK (для React Router)
// ═══════════════════════════════════════════════════════════
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ═══════════════════════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════════════════════
app.listen(PORT, async () => {
    console.log('═══════════════════════════════════════');
    console.log('🚀 NeuroCode AI started');
    console.log('🌐 Domain:', DOMAIN);
    console.log('📡 Port:', PORT);
    console.log('👥 Users:', db.users.length);
    console.log('═══════════════════════════════════════');
    
    // Установка webhook
    await setupBot(DOMAIN + WEBHOOK_PATH);
});

// Сохранение при выходе
process.on('SIGINT', () => { saveDB(); process.exit(); });
process.on('SIGTERM', () => { saveDB(); process.exit(); });

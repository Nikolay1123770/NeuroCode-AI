const express = require('express');
const router = express.Router();
const { db, saveDB } = require('./database');

// Проверка кода и вход/регистрация
router.post('/verify', (req, res) => {
    const { code } = req.body;
    
    if (!code || code.length !== 6) {
        return res.status(400).json({ error: 'Неверный формат кода' });
    }
    
    const authData = db.authCodes.get(code.toUpperCase());
    
    if (!authData) {
        return res.status(401).json({ error: 'Неверный или истекший код' });
    }
    
    // Удаляем использованный код
    db.authCodes.delete(code.toUpperCase());
    
    // Ищем существующего пользователя
    let user = db.users.find(u => u.telegramId === authData.telegramId);
    
    if (!user) {
        // Создаем нового пользователя
        user = {
            id: `user_${authData.telegramId}`,
            telegramId: authData.telegramId,
            username: authData.username,
            firstName: authData.firstName,
            lastName: authData.lastName || '',
            photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.username}`,
            apiKey: generateApiKey(),
            plan: 'free',
            requestsToday: 0,
            requestsLimit: 1000,
            totalRequests: 0,
            createdAt: new Date().toISOString()
        };
        
        db.users.push(user);
        saveDB();
        
        console.log(`✅ New user: ${user.username} (${user.telegramId})`);
    } else {
        console.log(`✅ User login: ${user.username}`);
    }
    
    res.json(user);
});

// Проверка сессии
router.post('/check', (req, res) => {
    const { telegramId } = req.body;
    
    if (!telegramId) {
        return res.json({ valid: false });
    }
    
    const user = db.users.find(u => u.telegramId === telegramId);
    
    if (!user) {
        return res.json({ valid: false });
    }
    
    res.json({ valid: true, user });
});

function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'nc_';
    for (let i = 0; i < 48; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

module.exports = router;

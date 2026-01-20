const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

let db = {
    users: [],
    authCodes: new Map()
};

// Загрузка базы
function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
            db.users = data.users || [];
            console.log(`📂 Database loaded: ${db.users.length} users`);
        }
    } catch (error) {
        console.error('❌ Database load error:', error.message);
    }
}

// Сохранение базы
function saveDB() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify({
            users: db.users
        }, null, 2));
    } catch (error) {
        console.error('❌ Database save error:', error.message);
    }
}

// Автосохранение каждые 30 секунд
setInterval(saveDB, 30000);

// Загружаем при старте
loadDB();

module.exports = { db, saveDB, loadDB };

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
    try {
        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
                ...options
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Telegram API error:', error);
    }
}

async function setupBot(webhookUrl) {
    try {
        const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: webhookUrl })
        });
        
        const data = await response.json();
        console.log('📱 Telegram webhook:', data.ok ? '✅' : '❌', data.description || '');
        
        return data.ok;
    } catch (error) {
        console.error('Webhook setup error:', error);
        return false;
    }
}

module.exports = { sendMessage, setupBot };

# backend/telegram_bot/bot.py
import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.config import settings
from app.services.telegram_auth import telegram_auth_service
from app.database import async_session_maker


class NeuroCodeBot:
    def __init__(self):
        self.application = Application.builder().token(settings.TELEGRAM_BOT_TOKEN).build()
        self._setup_handlers()
    
    def _setup_handlers(self):
        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(CommandHandler("login", self.login_command))
        self.application.add_handler(CommandHandler("help", self.help_command))
        self.application.add_handler(CallbackQueryHandler(self.button_callback))
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /start"""
        user = update.effective_user
        
        welcome_message = f"""
🤖 *Добро пожаловать в NeuroCode-AI, {user.first_name}!*

Я - ИИ-помощник для разработчиков. Помогу вам:
• Писать и анализировать код
• Находить и исправлять ошибки  
• Объяснять сложные концепции
• Генерировать код по описанию

Для начала работы с веб-версией нажмите кнопку ниже 👇
"""
        
        keyboard = [
            [InlineKeyboardButton("🔐 Получить код для входа", callback_data="get_auth_code")],
            [InlineKeyboardButton("📚 Помощь", callback_data="help")],
            [InlineKeyboardButton("🌐 Открыть веб-приложение", url="https://neurocode.ai")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            welcome_message,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    
    async def login_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /login"""
        await self._generate_auth_code(update)
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /help"""
        help_text = """
📚 *Помощь по NeuroCode-AI*

*Команды:*
/start - Начать работу с ботом
/login - Получить код для входа в веб-версию
/help - Показать эту справку

*Как войти в веб-приложение:*
1. Нажмите /login или кнопку "Получить код"
2. Скопируйте полученный код
3. Введите его на сайте neurocode.ai

*Возможности:*
🔹 Анализ кода на любом языке
🔹 Поиск и исправление ошибок
🔹 Объяснение сложного кода
🔹 Генерация кода по описанию
🔹 Code review и рефакторинг

По вопросам: @neurocode_support
"""
        await update.message.reply_text(help_text, parse_mode="Markdown")
    
    async def button_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик нажатий на кнопки"""
        query = update.callback_query
        await query.answer()
        
        if query.data == "get_auth_code":
            await self._generate_auth_code_callback(query)
        elif query.data == "help":
            help_text = """
📚 *Быстрая помощь*

Нажмите "Получить код для входа" чтобы авторизоваться в веб-приложении.

Код действителен 5 минут.
"""
            await query.message.reply_text(help_text, parse_mode="Markdown")
    
    async def _generate_auth_code(self, update: Update):
        """Генерация кода авторизации"""
        user = update.effective_user
        
        async with async_session_maker() as db:
            # Получить фото профиля
            photo_url = None
            try:
                photos = await user.get_profile_photos(limit=1)
                if photos.total_count > 0:
                    file = await photos.photos[0][0].get_file()
                    photo_url = file.file_path
            except:
                pass
            
            code = await telegram_auth_service.create_auth_code(
                db=db,
                telegram_id=user.id,
                username=user.username,
                first_name=user.first_name,
                last_name=user.last_name,
                photo_url=photo_url
            )
        
        message = f"""
🔐 *Ваш код для входа:*

⏱ Код действителен *5 минут*

Введите его на сайте для авторизации.
"""
        
        keyboard = [
            [InlineKeyboardButton("🔄 Получить новый код", callback_data="get_auth_code")],
            [InlineKeyboardButton("🌐 Открыть сайт", url="https://neurocode.ai")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            message,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    
    async def _generate_auth_code_callback(self, query):
        """Генерация кода через callback"""
        user = query.from_user
        
        async with async_session_maker() as db:
            code = await telegram_auth_service.create_auth_code(
                db=db,
                telegram_id=user.id,
                username=user.username,
                first_name=user.first_name,
                last_name=user.last_name
            )
        
        message = f"""
🔐 *Ваш новый код для входа:*
        
⏱ Код действителен *5 минут*
"""
        
        keyboard = [
            [InlineKeyboardButton("🔄 Получить новый код", callback_data="get_auth_code")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.message.reply_text(
            message,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    
    def run(self):
        """Запуск бота"""
        self.application.run_polling(allowed_updates=Update.ALL_TYPES)


def main():
    bot = NeuroCodeBot()
    bot.run()


if __name__ == "__main__":
    main()

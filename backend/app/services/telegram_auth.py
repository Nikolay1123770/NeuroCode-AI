# backend/app/services/telegram_auth.py
import redis.asyncio as redis
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import User, AuthCode
from app.config import settings


class TelegramAuthService:
    def __init__(self):
        self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.code_ttl = 300  # 5 минут
    
    async def create_auth_code(self, db: AsyncSession, telegram_id: int, 
                                username: str = None, first_name: str = None,
                                last_name: str = None, photo_url: str = None) -> str:
        """Создать код авторизации для пользователя Telegram"""
        
        # Найти или создать пользователя
        result = await db.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            user = User(
                telegram_id=telegram_id,
                username=username,
                first_name=first_name,
                last_name=last_name,
                photo_url=photo_url
            )
            db.add(user)
            await db.flush()
        else:
            # Обновить информацию о пользователе
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            if photo_url:
                user.photo_url = photo_url
        
        # Создать код
        code = AuthCode.generate_code()
        auth_code = AuthCode(
            code=code,
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(seconds=self.code_ttl)
        )
        db.add(auth_code)
        await db.commit()
        
        # Сохранить в Redis для быстрого доступа
        await self.redis.setex(
            f"auth_code:{code}",
            self.code_ttl,
            str(user.id)
        )
        
        return code
    
    async def verify_auth_code(self, db: AsyncSession, code: str) -> User | None:
        """Проверить код авторизации"""
        code = code.upper().strip()
        
        # Быстрая проверка в Redis
        user_id = await self.redis.get(f"auth_code:{code}")
        
        if not user_id:
            # Проверить в базе
            result = await db.execute(
                select(AuthCode).where(
                    AuthCode.code == code,
                    AuthCode.is_used == False,
                    AuthCode.expires_at > datetime.utcnow()
                )
            )
            auth_code = result.scalar_one_or_none()
            
            if not auth_code:
                return None
            
            user_id = auth_code.user_id
            auth_code.is_used = True
        else:
            # Пометить код как использованный
            result = await db.execute(
                select(AuthCode).where(AuthCode.code == code)
            )
            auth_code = result.scalar_one_or_none()
            if auth_code:
                auth_code.is_used = True
            
            # Удалить из Redis
            await self.redis.delete(f"auth_code:{code}")
        
        # Получить пользователя
        result = await db.execute(
            select(User).where(User.id == int(user_id))
        )
        user = result.scalar_one_or_none()
        
        await db.commit()
        return user


telegram_auth_service = TelegramAuthService()

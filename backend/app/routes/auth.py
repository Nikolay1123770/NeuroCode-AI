# backend/app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import timedelta

from app.database import get_db
from app.models import User
from app.services.telegram_auth import telegram_auth_service
from app.utils.security import create_access_token, verify_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


class CodeVerifyRequest(BaseModel):
    code: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: int
    telegram_id: int
    username: str | None
    first_name: str | None
    last_name: str | None
    photo_url: str | None
    is_premium: bool


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Получить текущего пользователя по токену"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен"
        )
    
    result = await db.execute(
        select(User).where(User.id == int(user_id))
    )
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден или деактивирован"
        )
    
    return user


@router.post("/verify-code", response_model=TokenResponse)
async def verify_telegram_code(
    request: CodeVerifyRequest,
    db: AsyncSession = Depends(get_db)
):
    """Проверить код авторизации из Telegram"""
    user = await telegram_auth_service.verify_auth_code(db, request.code)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный или истёкший код"
        )
    
    # Создать токен
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": user.id,
            "telegram_id": user.telegram_id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "photo_url": user.photo_url,
            "is_premium": user.is_premium
        }
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Получить информацию о текущем пользователе"""
    return UserResponse(
        id=current_user.id,
        telegram_id=current_user.telegram_id,
        username=current_user.username,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        photo_url=current_user.photo_url,
        is_premium=current_user.is_premium
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Выйти из системы"""
    # В реальном приложении можно добавить токен в черный список
    return {"message": "Успешный выход"}

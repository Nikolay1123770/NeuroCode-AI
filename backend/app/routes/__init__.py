# backend/app/routes/__init__.py
from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
from app.routes.code import router as code_router

__all__ = ["auth_router", "chat_router", "code_router"]

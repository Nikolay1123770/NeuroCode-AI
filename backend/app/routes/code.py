# backend/app/routes/code.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.models import User
from app.routes.auth import get_current_user
from app.services.ai_service import ai_service
from app.services.code_analyzer import code_analyzer

router = APIRouter(prefix="/code", tags=["code"])


class AnalyzeCodeRequest(BaseModel):
    code: str
    language: Optional[str] = None


class FixCodeRequest(BaseModel):
    code: str
    error: Optional[str] = None
    language: Optional[str] = None


class ExplainCodeRequest(BaseModel):
    code: str
    language: Optional[str] = None


class GenerateCodeRequest(BaseModel):
    prompt: str
    language: str


@router.post("/analyze")
async def analyze_code(
    request: AnalyzeCodeRequest,
    current_user: User = Depends(get_current_user)
):
    """Анализировать код"""
    # Определить язык, если не указан
    language = request.language or code_analyzer.detect_language(request.code)
    
    # Получить анализ от AI
    analysis = await ai_service.analyze_code(request.code, language)
    
    # Добавить статистику
    stats = code_analyzer.count_lines(request.code)
    
    return {
        "analysis": analysis["analysis"],
        "language": language,
        "stats": stats
    }


@router.post("/fix")
async def fix_code(
    request: FixCodeRequest,
    current_user: User = Depends(get_current_user)
):
    """Исправить код"""
    language = request.language or code_analyzer.detect_language(request.code)
    
    fixed = await ai_service.fix_code(
        request.code, 
        request.error, 
        language
    )
    
    return {
        "fixed_code": fixed,
        "language": language
    }


@router.post("/explain")
async def explain_code(
    request: ExplainCodeRequest,
    current_user: User = Depends(get_current_user)
):
    """Объяснить код"""
    language = request.language or code_analyzer.detect_language(request.code)
    
    prompt = f"""Объясни подробно следующий код:

```{language}
{request.code}

# backend/app/services/ai_service.py
from openai import AsyncOpenAI
from app.config import settings


class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.system_prompt = """Ты NeuroCode-AI - продвинутый ИИ-помощник для разработчиков.

Твои возможности:
1. Анализ и объяснение кода на любом языке программирования
2. Написание и рефакторинг кода
3. Поиск и исправление ошибок
4. Оптимизация производительности
5. Объяснение концепций программирования
6. Code review и рекомендации

Правила:
- Всегда форматируй код в блоках ```language
- Давай подробные объяснения
- Предлагай лучшие практики
- Отвечай на русском языке, если не попросят иначе"""

    async def chat(self, messages: list[dict], model: str = "gpt-4o") -> str:
        """Отправить сообщение в чат"""
        
        full_messages = [
            {"role": "system", "content": self.system_prompt}
        ] + messages
        
        response = await self.client.chat.completions.create(
            model=model,
            messages=full_messages,
            max_tokens=4096,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    async def analyze_code(self, code: str, language: str = None) -> dict:
        """Анализировать код"""
        
        prompt = f"""Проанализируй следующий код:

```{language or ''}
{code}

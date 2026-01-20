# backend/app/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models import User, ChatSession, Message
from app.routes.auth import get_current_user
from app.services.ai_service import ai_service
from app.utils.security import verify_token

router = APIRouter(prefix="/chat", tags=["chat"])


class CreateSessionRequest(BaseModel):
    title: Optional[str] = "Новый чат"


class SendMessageRequest(BaseModel):
    content: str
    session_id: int


class SessionResponse(BaseModel):
    id: int
    title: str
    created_at: str
    message_count: int


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: str


@router.post("/sessions", response_model=SessionResponse)
async def create_session(
    request: CreateSessionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создать новую сессию чата"""
    session = ChatSession(
        user_id=current_user.id,
        title=request.title
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    return SessionResponse(
        id=session.id,
        title=session.title,
        created_at=session.created_at.isoformat(),
        message_count=0
    )


@router.get("/sessions")
async def get_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить все сессии чата пользователя"""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
    )
    sessions = result.scalars().all()
    
    response = []
    for session in sessions:
        msg_result = await db.execute(
            select(Message).where(Message.session_id == session.id)
        )
        messages = msg_result.scalars().all()
        
        response.append({
            "id": session.id,
            "title": session.title,
            "created_at": session.created_at.isoformat(),
            "message_count": len(messages)
        })
    
    return response


@router.get("/sessions/{session_id}/messages")
async def get_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить все сообщения сессии"""
    # Проверить, что сессия принадлежит пользователю
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    
    msg_result = await db.execute(
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(Message.created_at)
    )
    messages = msg_result.scalars().all()
    
    return [
        {
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at.isoformat()
        }
        for msg in messages
    ]


@router.post("/send")
async def send_message(
    request: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Отправить сообщение и получить ответ AI"""
    # Проверить сессию
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    
    # Сохранить сообщение пользователя
    user_message = Message(
        session_id=session.id,
        role="user",
        content=request.content
    )
    db.add(user_message)
    await db.flush()
    
    # Получить историю сообщений
    msg_result = await db.execute(
        select(Message)
        .where(Message.session_id == session.id)
        .order_by(Message.created_at)
    )
    messages = msg_result.scalars().all()
    
    # Подготовить контекст для AI
    chat_history = [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]
    
    # Получить ответ от AI
    ai_response = await ai_service.chat(chat_history)
    
    # Сохранить ответ AI
    assistant_message = Message(
        session_id=session.id,
        role="assistant",
        content=ai_response
    )
    db.add(assistant_message)
    await db.commit()
    
    # Обновить заголовок сессии, если это первое сообщение
    if len(messages) <= 1:
        session.title = request.content[:50] + ("..." if len(request.content) > 50 else "")
        await db.commit()
    
    return {
        "user_message": {
            "id": user_message.id,
            "role": "user",
            "content": request.content,
            "created_at": user_message.created_at.isoformat()
        },
        "assistant_message": {
            "id": assistant_message.id,
            "role": "assistant",
            "content": ai_response,
            "created_at": assistant_message.created_at.isoformat()
        }
    }


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удалить сессию чата"""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    
    await db.delete(session)
    await db.commit()
    
    return {"message": "Сессия удалена"}


# WebSocket для стриминга
@router.websocket("/ws/{session_id}")
async def websocket_chat(
    websocket: WebSocket,
    session_id: int,
    token: str
):
    await websocket.accept()
    
    # Проверить токен
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    
    user_id = int(payload.get("sub"))
    
    async with async_session_maker() as db:
        # Проверить сессию
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.id == session_id,
                ChatSession.user_id == user_id
            )
        )
        session = result.scalar_one_or_none()
        
        if not session:
            await websocket.close(code=4004)
            return
        
        try:
            while True:
                data = await websocket.receive_json()
                content = data.get("content", "")
                
                if not content:
                    continue
                
                # Сохранить сообщение пользователя
                user_message = Message(
                    session_id=session.id,
                    role="user",
                    content=content
                )
                db.add(user_message)
                await db.flush()
                
                # Получить историю
                msg_result = await db.execute(
                    select(Message)
                    .where(Message.session_id == session.id)
                    .order_by(Message.created_at)
                )
                messages = msg_result.scalars().all()
                
                chat_history = [
                    {"role": msg.role, "content": msg.content}
                    for msg in messages
                ]
                
                # Стриминг ответа
                full_response = ""
                async for chunk in ai_service.stream_chat(chat_history):
                    full_response += chunk
                    await websocket.send_json({
                        "type": "chunk",
                        "content": chunk
                    })
                
                # Сохранить полный ответ
                assistant_message = Message(
                    session_id=session.id,
                    role="assistant",
                    content=full_response
                )
                db.add(assistant_message)
                await db.commit()
                
                await websocket.send_json({
                    "type": "complete",
                    "message_id": assistant_message.id
                })
                
        except WebSocketDisconnect:
            pass

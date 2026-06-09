from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import ask_ai

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(
    data: ChatRequest
):

    answer = ask_ai(
        data.question
    )

    return {
        "answer": answer
    }
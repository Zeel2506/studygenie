from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import ask_ai

router = APIRouter()

class FlashcardRequest(BaseModel):
    content: str

@router.post("/generate")
async def generate_flashcards(data: FlashcardRequest):

    prompt = f"""
Create 10 flashcards.

Format EXACTLY like:

Q: Question here
A: Answer here

Q: Another question
A: Another answer

Content:
{data.content}
"""

    result = ask_ai(prompt)

    return {
        "flashcards": result
    }
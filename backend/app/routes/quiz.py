from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import ask_ai

router = APIRouter()

class QuizRequest(BaseModel):
    content: str

@router.post("/generate")
async def generate_quiz(data: QuizRequest):
    prompt = f"""
You are a quiz generator.

Create EXACTLY 10 MCQs ONLY from the provided notes.

Rules:
- Use ONLY the information from the notes.
- Do NOT use outside knowledge.
- Do NOT create questions from other subjects.
- Each question must have 4 options.
- Provide the correct answer.

Format EXACTLY:

Q: Question here
A) Option
B) Option
C) Option
D) Option
ANSWER: A

Q: Next question
A) ...
B) ...
C) ...
D) ...
ANSWER: B

Notes:
{data.content}
"""

    result = ask_ai(prompt)

    return {
        "quiz": result
    }
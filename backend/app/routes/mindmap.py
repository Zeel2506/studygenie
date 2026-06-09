from fastapi import APIRouter
from pydantic import BaseModel

from app.services.openai_service import ask_ai

router = APIRouter()

class MindMapRequest(BaseModel):
    topic: str

@router.post("/generate")
async def generate_mindmap(
    data: MindMapRequest
):
    prompt = f"""
Create a detailed educational mind map for:

{data.topic}

Rules:

Return in this exact format:

Main Topic

- Branch Name
  - Subtopic : short explanation

- Branch Name
  - Subtopic : short explanation

For mathematical topics include formulas.
For science topics include definitions and examples.
For programming topics include syntax and examples.

Example:

Triangles

- Formulas
  - Perimeter : P = a + b + c
  - Area : A = 1/2 × b × h
  - Heron's Formula : A = √(s(s-a)(s-b)(s-c))

- Types
  - Equilateral : all sides equal
  - Isosceles : two sides equal
  - Scalene : no sides equal

- Applications
  - Architecture : used in roof design
  - Engineering : used in bridge structures

Return only the mind map.
"""
    result = ask_ai(prompt)

    return {
        "mindmap": result
    }
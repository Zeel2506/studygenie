from fastapi import APIRouter
from pydantic import BaseModel

from app.database.mongodb import db
from app.services.openai_service import ask_ai



router = APIRouter()



class PlannerRequest(BaseModel):
    subject: str
    days: int



@router.post("/generate")
async def generate_plan(data: PlannerRequest):

    notes = await db.notes.find(
        {
            "subject": data.subject
        }
    ).to_list(100)

    topics = [
        note["question"]
        for note in notes
    ]

    prompt = f"""
Create a {data.days}-day study plan.

Subject:
{data.subject}

Topics:
{topics}

Rules:
- One topic per day.
- Format EXACTLY like:

Day 1:
Newton's Laws

Day 2:
Work Done

Day 3:
Gravitation

Continue until all days are filled.
"""

    plan = ask_ai(prompt)

    return {
        "plan": plan
    }
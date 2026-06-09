from fastapi import APIRouter
from app.database.mongodb import db

router = APIRouter()

@router.get("/all")
async def get_achievements():

    achievements = []

    notes_count = await db.notes.count_documents({})
    quiz_count = await db.quiz_results.count_documents({})

    if notes_count >= 1:
        achievements.append(
            {
                "title": "First Note",
                "description": "Created first note"
            }
        )

    if notes_count >= 10:
        achievements.append(
            {
                "title": "Note Master",
                "description": "Created 10 notes"
            }
        )

    if quiz_count >= 1:
        achievements.append(
            {
                "title": "Quiz Beginner",
                "description": "Completed first quiz"
            }
        )

    if quiz_count >= 5:
        achievements.append(
            {
                "title": "Quiz Champion",
                "description": "Completed 5 quizzes"
            }
        )

    return achievements
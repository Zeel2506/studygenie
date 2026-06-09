from fastapi import APIRouter
from app.database.mongodb import db

router = APIRouter()

@router.get("/predict")
async def predict():

    notes_count = await db.notes.count_documents({})

    quizzes = await db.quiz_results.find().to_list(100)

    if quizzes:
        avg_score = sum(
            q["score"] * 100 / q["total"]
            for q in quizzes
        ) / len(quizzes)
    else:
        avg_score = 0

    readiness = min(
        100,
        int(
            avg_score * 0.7 +
            notes_count * 2
        )
    )

    return {
        "readiness": readiness,
        "average_score": round(avg_score, 1)
    }
from fastapi import APIRouter, Header
from pydantic import BaseModel
from app.database.mongodb import db
from app.services.security import verify_token

router = APIRouter()

class QuizResult(BaseModel):
    subject: str
    score: int
    total: int
    user_email: str

@router.post("/save")
async def save_quiz_result(data: QuizResult):
    await db.quiz_results.insert_one({
        "subject": data.subject,
        "score": data.score,
        "total": data.total,
        "user_email": data.user_email
    })

    return {
        "message": "Saved"
    }

from fastapi import HTTPException


@router.get("/summary")
async def summary(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid Token")

    email = payload["email"]

    results = await db.quiz_results.find({"user_email": email}).to_list(1000)

    if not results:
        return {"quizzes": 0, "average": 0, "best_subject": "N/A"}

    total_quizzes = len(results)

    average_score = round(
        sum((r["score"] / r["total"]) * 100 for r in results) / total_quizzes
    )

    subject_stats = {}

    for result in results:
        subject = result["subject"]
        percentage = (result["score"] / result["total"]) * 100
        subject_stats.setdefault(subject, []).append(percentage)

    subject_averages = {subject: round(sum(scores) / len(scores)) for subject, scores in subject_stats.items()}

    best_subject = max(subject_averages, key=subject_averages.get)

    return {"quizzes": total_quizzes, "average": average_score, "best_subject": best_subject}
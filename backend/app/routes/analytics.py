from fastapi import APIRouter, Header
from app.database.mongodb import db
from app.services.security import verify_token

router = APIRouter()

@router.get("/summary")
async def analytics_summary(
    authorization: str = Header(...)
):
    token = authorization.replace(
    "Bearer ",
    ""
)

    payload = verify_token(token)

    email = payload["email"]

    notes = await db.notes.find(
    {"user_email": email}
).to_list(None)

    subject_counts = {}

    for note in notes:

        subject = note.get(
            "subject",
            "Unknown"
        )

        subject_counts[subject] = (
            subject_counts.get(subject, 0)
            + 1
        )

    total_notes = len(notes)

    return {
        "total_notes": total_notes,
        "subjects": subject_counts
    }

@router.get("/recommendation")
async def recommendation():

    notes = await db.notes.find().to_list(1000)

    quizzes = await db.quiz_results.find().to_list(1000)

    if not notes:

        return {
            "recommendation":
            "Start creating notes to receive AI insights."
        }

    subject_counts = {}

    for note in notes:

        subject = note.get(
            "subject",
            "Unknown"
        )

        subject_counts[subject] = (
            subject_counts.get(
                subject,
                0
            ) + 1
        )

    strongest_subject = max(
        subject_counts,
        key=subject_counts.get
    )

    weakest_subject = min(
        subject_counts,
        key=subject_counts.get
    )

    if quizzes:

        avg_score = round(
            sum(
                (
                    q["score"] /
                    q["total"]
                ) * 100
                for q in quizzes
            ) / len(quizzes)
        )

    else:

        avg_score = 0

    recommendation = f"""
Your strongest subject is {strongest_subject}.

Your weakest subject is {weakest_subject}.

Current quiz average: {avg_score}%.

Focus on {weakest_subject}
for your next study session.
"""

    return {
        "recommendation":
        recommendation
    }
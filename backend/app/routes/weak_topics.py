from fastapi import APIRouter
from app.database.mongodb import db

router = APIRouter()

@router.get("/analyze")
async def analyze():

    notes = await db.notes.find().to_list(100)

    subject_count = {}

    for note in notes:

        subject = note.get(
            "subject",
            "Unknown"
        )

        subject_count[subject] = (
            subject_count.get(
                subject,
                0
            ) + 1
        )

    weak_subjects = sorted(
        subject_count.items(),
        key=lambda x: x[1]
    )[:3]

    return {
        "weak_topics":
        [
            subject
            for subject, count
            in weak_subjects
        ]
    }
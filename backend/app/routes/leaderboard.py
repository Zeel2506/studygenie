from fastapi import APIRouter
from app.database.mongodb import db

router = APIRouter()

@router.get("/all")
async def leaderboard():

    users = await db.users.find(
        {},
        {"_id": 0}
    ).to_list(length=None)

    leaderboard_data = []

    for user in users:

        notes = user.get(
            "notes_count",
            0
        )

        quizzes = user.get(
            "quiz_attempts",
            0
        )

        avg_score = user.get(
            "avg_score",
            0
        )

        points = (
            notes * 10
            +
            quizzes * 20
            +
            avg_score
        )

        leaderboard_data.append(
            {
                "name":
                user["name"],

                "points":
                points,

                "notes":
                notes,

                "quizzes":
                quizzes,

                "score":
                avg_score
            }
        )

    leaderboard_data.sort(
        key=lambda x:
        x["points"],
        reverse=True
    )

    return leaderboard_data
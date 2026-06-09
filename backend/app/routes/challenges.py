from fastapi import APIRouter

router = APIRouter()

@router.get("/today")
async def challenges():

    return {
        "xp": 120,

        "challenges": [

            {
                "title":
                "Create 3 Notes",

                "current": 2,

                "target": 3
            },

            {
                "title":
                "Complete 2 Quizzes",

                "current": 1,

                "target": 2
            },

            {
                "title":
                "Generate 1 Mind Map",

                "current": 1,

                "target": 1
            },

            {
                "title":
                "Summarize 1 PDF",

                "current": 0,

                "target": 1
            }

        ]
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.ai import router as ai_router
from app.routes.notes import router as notes_router
#from app.routes.audio import router as audio_router
from app.routes.flashcards import router as flashcard_router
from app.routes.quiz import router as quiz_router
from app.routes.study_buddy import router as study_router
from app.routes.planner import router as planner_router
from app.routes.analytics import router as analytics_router
from app.routes.quiz_analytics import router as quiz_analytics_router
from app.routes.achievements import router as achievement_router
from app.routes.performance import router as performance_router
from app.routes.weak_topics import router as weak_router
from app.routes.mindmap import router as mindmap_router
from app.routes.pdf_summarizer import router as pdf_router
from app.routes.leaderboard import router as leaderboard_router
from app.routes.challenges import router as challenges_router

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://frontend-fg61.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    ai_router,
    prefix="/ai",
    tags=["AI"]
)

app.include_router(
    notes_router,
    prefix="/notes",
    tags=["Notes"]
)

#app.include_router(
#    audio_router,
#    prefix="/audio",
#    tags=["Audio"]
#)

app.include_router(
    flashcard_router,
    prefix="/flashcards",
    tags=["Flashcards"]
)

app.include_router(
    quiz_router,
    prefix="/quiz",
    tags=["Quiz"]
)

app.include_router(
    study_router,
    prefix="/study"
)

app.include_router(
    planner_router,
    prefix="/planner"
)

app.include_router(
    analytics_router,
    prefix="/analytics"
)

app.include_router(
    quiz_analytics_router,
    prefix="/quiz-analytics"
)

app.include_router(
    achievement_router,
    prefix="/achievements"
)

app.include_router(
    performance_router,
    prefix="/performance"
)

app.include_router(
    weak_router,
    prefix="/weak-topics"
)

app.include_router(
    mindmap_router,
    prefix="/mindmap"
)

app.include_router(
    pdf_router,
    prefix="/pdf",
    tags=["PDF Summarizer"]
)

app.include_router(
    leaderboard_router,
    prefix="/leaderboard"
)

app.include_router(
    challenges_router,
    prefix="/challenges"
)

@app.get("/")
async def home():
    return {
        "message": "StudyGenie Backend Running"
    }
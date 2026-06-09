from fastapi import APIRouter
from pydantic import BaseModel
from app.database.mongodb import db
from datetime import datetime
from bson import ObjectId
from app.services.openai_service import detect_subject
router = APIRouter()

class NoteRequest(BaseModel):
    question: str
    answer: str
    user_email: str

@router.post("/save")
async def save_note(data: NoteRequest):

    subject = detect_subject(data.question)

    subject = (
    subject
    .replace(".", "")
    .replace("The subject is", "")
    .strip()
)

    note = {
        "question": data.question,
        "answer": data.answer,
        "subject": subject,
        "user_email": data.user_email,
        "created_at": str(datetime.now())
    }

    await db.notes.insert_one(note)

    return {
        "message": "Note Saved Successfully"
    }

@router.get("/test")
async def test_notes():

    collections = await db.list_collection_names()

    return {
        "collections": collections
    }

@router.delete("/{note_id}")
async def delete_note(note_id: str):

    result = await db.notes.delete_one(
        {"_id": ObjectId(note_id)}
    )

    if result.deleted_count == 0:
        return {
            "message": "Note not found"
        }

    return {
        "message": "Note deleted successfully"
    }

@router.get("/all")
async def get_all_notes():

    notes = []

    async for note in db.notes.find():

        note["_id"] = str(note["_id"])

        notes.append(note)

    return notes

@router.get("/user/{email}")
async def get_user_notes(email: str):

    notes = []

    async for note in db.notes.find(
        {"user_email": email}
    ):
        note["_id"] = str(note["_id"])
        notes.append(note)

    return notes
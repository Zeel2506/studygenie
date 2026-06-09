from fastapi import APIRouter, UploadFile, File
import whisper
import os
from app.services.openai_service import ask_ai

router = APIRouter()

model = whisper.load_model("base")

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...)
):

    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as buffer:
        buffer.write(
            await file.read()
        )

    result = model.transcribe(filepath)

    transcript = result["text"]

    summary = ask_ai(
        f"""
        Create structured study notes from this lecture.

        Include:
        1. Key Concepts
        2. Important Definitions
        3. Important Points
        4. Quick Revision Notes

        Lecture:

        {transcript}
        """
    )

    flashcards = ask_ai(
    f"""
    Create 10 flashcards from this lecture.

    Format exactly like:

    Q: What is Photosynthesis?
    A: Process by which plants make food.

    Q: Another question
    A: Answer

    Lecture:

    {transcript}
    """
)

    return {
    "transcript": transcript,
    "summary": summary,
    "flashcards": flashcards
}

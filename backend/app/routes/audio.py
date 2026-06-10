from fastapi import APIRouter, UploadFile, File
from groq import Groq
import os
from app.services.openai_service import ask_ai
os.makedirs("uploads", exist_ok=True)
router = APIRouter()



client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...)
):

    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as buffer:
        buffer.write(
            await file.read()
        )

    with open(filepath, "rb") as audio_file:
     transcription = client.audio.transcriptions.create(
        file=audio_file,
    
        model="whisper-large-v3"
    )

    transcript = transcription.text
    os.remove(filepath)

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

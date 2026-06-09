from fastapi import APIRouter
from pydantic import BaseModel

from app.database.mongodb import db
from app.services.openai_service import ask_ai

router = APIRouter()

class StudyRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_study_buddy(data: StudyRequest):
    stop_words = {
        "what",
        "is",
        "are",
        "the",
        "a",
        "an",
        "of",
        "for",
        "in",
        "to",
        "and",
        "explain"
    }

    question_words = [
        word
        for word in data.question.lower().split()
        if word not in stop_words
    ]

    all_notes = await db.notes.find().to_list(100)

    scored_notes = []

    for note in all_notes:

        text = (
            note["question"] +
            " " +
            note["answer"]
        ).lower()

        score = 0

        for word in question_words:
            if word in text:
                score += 1

        if score > 0:
            scored_notes.append((score, note))

    scored_notes.sort(
        reverse=True,
        key=lambda x: x[0]
    )

    relevant_notes = [
        note
        for score, note
        in scored_notes[:5]
    ]

    context = "\n\n".join(
        f"Q: {note['question']}\nA: {note['answer']}"
        for note in relevant_notes
    )
    print(
        "Relevant Notes:",
        len(relevant_notes)
    )

    for note in relevant_notes:
        print(
            note["question"]
        )
    
    print("QUESTION:", data.question)
    print("RELEVANT NOTES COUNT:", len(relevant_notes))

    for note in relevant_notes:
        print("MATCHED:", note["question"])

    if len(relevant_notes) == 0:
        return {
            "answer":
            "This topic is not available in your notes."
        }
    prompt = f"""
You are StudyGenie AI.

Use ONLY the notes provided.

Always answer in this structure:

# Topic

## Definition

## Key Points

## Formula (if applicable)

## Example

## Exam Tips

If answer not found:
This topic is not available in your notes.

Notes:
{context}

Question:
{data.question}
"""
    answer = ask_ai(prompt)

    return {
        "answer": answer
    }
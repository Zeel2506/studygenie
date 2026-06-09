from fastapi import APIRouter, UploadFile, File
from pypdf import PdfReader
import tempfile

from app.services.openai_service import ask_ai

router = APIRouter()

@router.post("/summarize")
async def summarize_pdf(
    file: UploadFile = File(...)
):

    # Save uploaded PDF temporarily
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        content = await file.read()

        temp_file.write(content)

        pdf_path = temp_file.name

    # Extract text
    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:

        try:
            text += page.extract_text() + "\n"
        except:
            pass

    # Limit very large PDFs
    text = text[:15000]

    prompt = f"""
You are an expert study assistant.

Summarize the following PDF.

Return:

1. Main Topics
2. Important Concepts
3. Key Formulas
4. Exam Preparation Notes

PDF Content:

{text}
"""

    summary = ask_ai(prompt)

    return {
        "summary": summary
    }
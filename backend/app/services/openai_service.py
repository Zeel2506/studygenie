from groq import Groq
from dotenv import load_dotenv
import os
import ollama

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def ask_ai(prompt: str):

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=2048
        )

        print("Using GROQ")

        return response.choices[0].message.content

    except Exception as e:

        print("Groq Failed")

        print(e)

        print("Using Ollama Fallback")

        response = ollama.chat(
            model="llama3.2:1b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response["message"]["content"]
    
def detect_subject(text: str):

    prompt = f"""
Classify the following text into ONE subject only.

Choose from:
Physics
Chemistry
Mathematics
Biology
Computer Science
General

Text:
{text}

Return ONLY the subject name.
"""

    return ask_ai(prompt).strip()
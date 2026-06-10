import os
import resend

print("RESEND KEY:", os.getenv("RESEND_API_KEY"))
resend.api_key = os.getenv("RESEND_API_KEY")

def send_email(
    recipient: str,
    subject: str,
    body: str
):
    resend.Emails.send({
        "from": "StudyGenie <onboarding@resend.dev>",
        "to": recipient,
        "subject": subject,
        "text": body,
    })
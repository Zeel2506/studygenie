from app.services.email_service import send_email

send_email(
    "studygenie.app25@gmail.com",
    "StudyGenie Test",
    "Email service working!"
)

print("Email sent")
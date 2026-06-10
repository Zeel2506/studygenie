import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

def send_email(recipient, subject, body):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    sender = {
        "name": "zeel",
        "email": "zeel.25062005@gmail.com"
    }

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": recipient}],
        sender=sender,
        subject=subject,
        text_content=body
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        print("Brevo Error:", e)
        raise
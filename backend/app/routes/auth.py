from fastapi import APIRouter, HTTPException
from app.models.user import UserRegister, UpdateProfile
from app.database.mongodb import db
from passlib.context import CryptContext
from app.models.user import UserLogin
from app.services.security import create_access_token
from fastapi import Header
from app.services.security import verify_token
import random

from app.services.email_service import send_email
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import httpx

load_dotenv()
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

class GitHubCodeRequest(BaseModel):
    code: str

class GoogleLoginRequest(BaseModel):
    name: str
    email: str
    picture: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    password: str

class ResendOTPRequest(BaseModel):
    email: str

router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

@router.post("/register")
async def register(user: UserRegister):
    existing_user = await db.users.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user.password)
    otp = str(random.randint(100000, 999999))
    new_user = {
    "name": user.name,
    "email": user.email,
    "password": hashed_password,
    "verified": False,
    "otp": otp,
    "otp_created_at": datetime.utcnow()
}

    await db.users.insert_one(new_user)
    send_email(user.email, "StudyGenie OTP Verification", f"Your OTP is: {otp}")

    return {"message": "OTP Sent To Email"}

@router.post("/login")
async def login(user: UserLogin):
    existing_user = await db.users.find_one({"email": user.email})

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid Email")

    password_match = pwd_context.verify(user.password, existing_user["password"])

    if not password_match:
        raise HTTPException(status_code=401, detail="Invalid Password")

    if not existing_user.get("verified", False):
        raise HTTPException(status_code=401, detail="Please verify your email first")

    token = create_access_token({"email": existing_user["email"]})

    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
async def get_current_user(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Token Missing"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )
    print("TOKEN RECEIVED =", token)

    payload = verify_token(token)
    print("PAYLOAD RECEIVED =", payload)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = await db.users.find_one(
        {
            "email": payload["email"]
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    return {
    "name": user["name"],
    "email": user["email"],
    "picture": user.get("picture", "")
}

@router.post("/verify-otp")
async def verify_otp(
    data: VerifyOTPRequest
):

    user = await db.users.find_one(
        {
            "email": data.email
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    otp_time = user.get("otp_created_at")

    if not otp_time:
        raise HTTPException(status_code=400, detail="OTP Expired")

    if datetime.utcnow() - otp_time > timedelta(minutes=5):
        raise HTTPException(status_code=400, detail="OTP Expired")

    if user.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    await db.users.update_one(
    {"email": data.email},
    {
        "$set": {
            "verified": True
        },
        "$unset": {
            "otp": "",
            "otp_created_at": ""
        }
    }
)

    return {"message": "Email verified successfully"}

@router.get("/test")
async def test():
    return {
        "message": "Auth routes working"
    }

@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest
):

    user = await db.users.find_one(
        {
            "email": data.email
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    otp = str(
        random.randint(
            100000,
            999999
        )
    )
    otp_created_at = datetime.utcnow()

    await db.users.update_one(
        {
            "email": data.email
        },
        {
            "$set": {
                "otp": otp,
                "otp_created_at": otp_created_at
            }
        }
    )

    send_email(
        data.email,
        "StudyGenie Password Reset",
        f"Your reset OTP is: {otp}"
    )

    return {
        "message":
        "Reset OTP sent"
    }

@router.post("/verify-reset-otp")
async def verify_reset_otp(
    data: VerifyOTPRequest
):

    user = await db.users.find_one(
        {
            "email": data.email
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    otp_time = user.get("otp_created_at")

    if not otp_time:
        raise HTTPException(status_code=400, detail="OTP Expired")

    if datetime.utcnow() - otp_time > timedelta(minutes=5):
        raise HTTPException(status_code=400, detail="OTP Expired")

    if user.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    await db.users.update_one(
        {"email": data.email},
        {
            "$unset": {
                "otp": ""
            }
        }
    )

    return {
        "message": "OTP Verified"
    }

@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest
):

    user = await db.users.find_one(
        {
            "email": data.email
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    hashed_password = pwd_context.hash(
        data.password
    )

    await db.users.update_one(
        {
            "email": data.email
        },
        {
            "$set": {
                "password": hashed_password
            },
            "$unset": {
    "otp": "",
    "otp_created_at": ""
}
        }
    )

    return {
        "message":
        "Password reset successful"
    }

@router.post("/resend-otp")
async def resend_otp(
    data: ResendOTPRequest
):

    user = await db.users.find_one(
        {
            "email": data.email
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    otp = str(
        random.randint(
            100000,
            999999
        )
    )
    otp_created_at = datetime.utcnow()

    await db.users.update_one(
        {
            "email": data.email
        },
        {
            "$set": {
                "otp": otp,
                "otp_created_at": otp_created_at
            }
        }
    )

    send_email(
        data.email,
        "StudyGenie OTP Verification",
        f"Your OTP is: {otp}"
    )

    return {
        "message":
        "OTP resent successfully"
    }

@router.post("/google-login")
async def google_login(
    data: GoogleLoginRequest
):

    user = await db.users.find_one(
        {
            "email": data.email
        }
    )

    if not user:
        await db.users.insert_one(
            {
                "name": data.name,
                "email": data.email,
                "picture": data.picture,
                "verified": True,
                "google_user": True
            }
        )

    token = create_access_token(
        {
            "email": data.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/github-login")
async def github_login(
    data: GitHubCodeRequest
):

    async with httpx.AsyncClient() as client:

        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={
                "Accept": "application/json"
            },
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": data.code
            }
        )

        token_data = token_response.json()

        access_token = token_data.get(
            "access_token"
        )

        if not access_token:

            raise HTTPException(
                status_code=400,
                detail="GitHub token failed"
            )

        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization":
                f"Bearer {access_token}"
            }
        )

        github_user = user_response.json()

        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={
                "Authorization":
                f"Bearer {access_token}"
            }
        )

        emails = email_response.json()

        primary_email = None

        for email in emails:

            if email.get("primary"):

                primary_email = email.get(
                    "email"
                )

                break

        if not primary_email:

            raise HTTPException(
                status_code=400,
                detail="GitHub email not found"
            )

        existing_user = await db.users.find_one(
            {
                "email": primary_email
            }
        )

        if not existing_user:

            await db.users.insert_one(
                {
                    "name":
                    github_user.get(
                        "name"
                    )
                    or
                    github_user.get(
                        "login"
                    ),

                    "email":
                    primary_email,

                    "picture":
                    github_user.get(
                        "avatar_url"
                    ),

                    "verified":
                    True,

                    "github_user":
                    True
                }
            )

        token = create_access_token(
            {
                "email":
                primary_email
            }
        )

        return {
    "access_token": token,
    "token_type": "bearer",
    "name": github_user.get("name")
            or github_user.get("login"),
    "email": primary_email,
    "picture": github_user.get("avatar_url")
}
    
@router.put("/update-profile")
async def update_profile(
    profile: UpdateProfile,
    authorization: str = Header(...)
):
    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    email = payload["email"]

    await db.users.update_one(
    {"email": email},
    {
        "$set": {
            "name": profile.name
        }
    }
)

    return {
    "message": "Profile updated"
}
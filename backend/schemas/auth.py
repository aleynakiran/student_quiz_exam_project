"""Authentication request/response schemas."""

from typing import Literal

from pydantic import BaseModel, EmailStr, Field

RegistrationRole = Literal["student", "teacher"]


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: RegistrationRole = "student"


class UserPublic(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic

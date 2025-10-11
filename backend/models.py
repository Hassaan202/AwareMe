from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime



# AUTH MODELS
class SignupRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")
    role: str = Field(..., pattern="^(parent|child)$", description="User role: parent or child")
    name: str = Field(..., min_length=1, description="Full name")
    age: Optional[int] = Field(None, ge=1, le=100, description="Age (required for children)")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "parent@example.com",
                "password": "secure123",
                "role": "parent",
                "name": "John Doe",
                "age": None
            }
        }

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="Password")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "parent@example.com",
                "password": "secure123"
            }
        }

class AuthResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    user: Optional['UserResponse'] = None
    message: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    name: str
    age: Optional[int] = None




# CHAT MODELS
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="Chat message")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "What is good touch and bad touch?"
            }
        }

class ChatResponse(BaseModel):
    success: bool
    response: str
    distressDetected: Optional[bool] = False
    timestamp: str



# LEARNING MODELS
class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correctAnswer: int
    explanation: str

class Lesson(BaseModel):
    id: str
    title: str
    description: str
    content: str
    questions: List[QuizQuestion]

class QuizSubmission(BaseModel):
    lessonId: str
    answers: List[int]

    class Config:
        json_schema_extra = {
            "example": {
                "lessonId": "lesson-1",
                "answers": [0, 1, 2]
            }
        }

class QuizResult(BaseModel):
    success: bool
    score: int
    total: int
    passed: bool



# EMERGENCY MODELS
class EmergencyAlert(BaseModel):
    message: str = Field(..., description="Emergency message")
    location: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "message": "I need help!",
                "location": "At home"
            }
        }

class EmergencyResponse(BaseModel):
    success: bool
    message: str
    alertId: str
    notifiedContacts: List[str]



# PROFILE MODELS
class LinkChildRequest(BaseModel):
    childEmail: EmailStr = Field(..., description="Child's email address")

    class Config:
        json_schema_extra = {
            "example": {
                "childEmail": "child@example.com"
            }
        }

class LinkResponse(BaseModel):
    success: bool
    message: str



# RESOURCES MODELS
class Resource(BaseModel):
    id: str
    title: str
    description: str
    url: str
    category: str

class ResourcesResponse(BaseModel):
    success: bool
    resources: List[Resource]

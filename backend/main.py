import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
from models import *
from database import *
from auth import *
from ai_integration import *


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    init_db()
    yield
    # Shutdown: cleanup if needed
    pass

app = FastAPI(
    title="AwareMe",
    description="API for child safety education and parent guidance",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AUTH ROUTES
@app.post("/api/auth/signup", response_model=AuthResponse)
async def signup(data: SignupRequest):
    """Register a new user (parent or child)"""
    # Check if user exists
    existing_user = get_user_by_email(data.email)
    if existing_user:
        return AuthResponse(success=False, message="Email already registered")

    # Validate age for children
    if data.role == "child" and not data.age:
        return AuthResponse(success=False, message="Age is required for children")

    # Hash password and create user
    password_hash = hash_password(data.password)
    user_id = create_user(data.email, password_hash, data.role, data.name, data.age)

    # Create token
    token = create_token(user_id)

    user = UserResponse(
        id=user_id,
        email=data.email,
        role=data.role,
        name=data.name,
        age=data.age
    )

    return AuthResponse(success=True, token=token, user=user, message="Account created successfully")

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(data: LoginRequest):
    """Login existing user"""
    user = get_user_by_email(data.email)

    if not user or not verify_password(data.password, user['password_hash']):
        return AuthResponse(success=False, message="Invalid email or password")

    token = create_token(user['id'])

    user_response = UserResponse(
        id=user['id'],
        email=user['email'],
        role=user['role'],
        name=user['name'],
        age=user['age']
    )

    return AuthResponse(success=True, token=token, user=user_response, message="Login successful")


# PROFILE ROUTES
@app.get("/api/profile", response_model=UserResponse)
async def get_profile(current_user = Depends(get_current_user)):
    """Get current user profile"""
    user = get_user_by_id(current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user['id'],
        email=user['email'],
        role=user['role'],
        name=user['name'],
        age=user['age']
    )

@app.post("/api/profile/link-child", response_model=LinkResponse)
async def link_child(data: LinkChildRequest, current_user = Depends(get_current_user)):
    """Link a child to a parent account"""
    # Verify current user is a parent
    parent = get_user_by_id(current_user)
    if parent['role'] != 'parent':
        return LinkResponse(success=False, message="Only parents can link children")

    # Find child by email
    child = get_user_by_email(data.childEmail)
    if not child:
        return LinkResponse(success=False, message="Child account not found")

    if child['role'] != 'child':
        return LinkResponse(success=False, message="User is not a child account")

    # Create link
    link_parent_child(current_user, child['id'])

    return LinkResponse(success=True, message=f"Successfully linked to {child['name']}")

# CHAT ROUTES
@app.post("/api/chat/child", response_model=ChatResponse)
async def chat_child(data: ChatRequest, current_user = Depends(get_current_user)):
    """Child chatbot endpoint"""
    user = get_user_by_id(current_user)

    if user['role'] != 'child':
        raise HTTPException(status_code=403, detail="This chat is only for children")

    # Get AI response
    result = await child_chatbot(data.message)

    # Save to chat history
    save_chat_message(current_user, data.message, result['response'], result['distressDetected'])

    # If distress detected, create alert for parent
    if result['distressDetected']:
        parent_id = get_parent_of_child(current_user)
        if parent_id:
            create_emergency_alert(
                current_user,
                f"Distress detected in chat: {data.message[:100]}",
                "Chat conversation"
            )

    return ChatResponse(
        success=True,
        response=result['response'],
        distressDetected=result['distressDetected'],
        timestamp=datetime.utcnow().isoformat()
    )

@app.post("/api/chat/parent", response_model=ChatResponse)
async def chat_parent(data: ChatRequest, current_user = Depends(get_current_user)):
    """Parent guidance chatbot endpoint"""
    user = get_user_by_id(current_user)

    if user['role'] != 'parent':
        raise HTTPException(status_code=403, detail="This chat is only for parents")

    # Get AI response
    response = await parent_chatbot(data.message)

    # Save to chat history
    save_chat_message(current_user, data.message, response, False)

    return ChatResponse(
        success=True,
        response=response,
        distressDetected=False,
        timestamp=datetime.utcnow().isoformat()
    )

# LEARNING ROUTES
@app.get("/api/learning/lessons")
async def get_lessons():
    """Get interactive safety lessons for children"""
    lessons = [
        {
            "id": "lesson-1",
            "title": "Good Touch, Bad Touch 🤗",
            "description": "Learn about safe and unsafe touches",
            "content": """
            **What is Good Touch?**
            - Hugs from people you trust 🤗
            - High-fives with friends ✋
            - Doctor checkups with parents present 👨‍⚕️
            
            **What is Bad Touch?**
            - Touches that make you uncomfortable 😟
            - Someone touching private areas 🚫
            - Being forced to touch someone
            
            **Remember:**
            - Your body belongs to YOU! 💪
            - Say NO to uncomfortable touches
            - Tell a trusted adult immediately
            """,
            "questions": [
                {
                    "id": "q1",
                    "question": "Which is a good touch?",
                    "options": ["A hug from mom", "Someone touching private parts", "Being forced to kiss someone"],
                    "correctAnswer": 0,
                    "explanation": "Hugs from trusted family members are good touches! 🤗"
                },
                {
                    "id": "q2",
                    "question": "What should you do if someone makes you uncomfortable?",
                    "options": ["Keep it a secret", "Tell a trusted adult", "Do nothing"],
                    "correctAnswer": 1,
                    "explanation": "Always tell a trusted adult! It's never your fault. 💙"
                }
            ]
        },
        {
            "id": "lesson-2",
            "title": "My Body, My Rules 💪",
            "description": "Understanding body autonomy and consent",
            "content": """
            **Your Body Belongs to You!**
            - You decide who can touch you
            - You can say NO at any time 🛑
            - Even to family and friends
            
            **Private Parts:**
            - Parts covered by swimsuit 👙
            - Only you, parents, or doctors (with parents) can see
            - Tell an adult if someone asks to see or touch
            
            **It's Never Your Fault:**
            - If something bad happens, it's NOT your fault
            - You can always tell someone
            - Adults will help you 🌟
            """,
            "questions": [
                {
                    "id": "q1",
                    "question": "Can you say NO to anyone touching you?",
                    "options": ["No, must obey adults", "Yes, always!", "Only to strangers"],
                    "correctAnswer": 1,
                    "explanation": "YES! You can say NO to anyone, even family. Your body, your choice! 💪"
                }
            ]
        },
        {
            "id": "lesson-3",
            "title": "Trusted Adults 👨‍👩‍👧",
            "description": "Who to talk to when you need help",
            "content": """
            **Who are Trusted Adults?**
            - Parents or guardians 👨‍👩‍👧
            - Teachers 👩‍🏫
            - School counselors
            - Police officers 👮
            - Close family members
            
            **When to Tell Them:**
            - Someone makes you uncomfortable
            - You see something wrong
            - You have a secret that feels bad
            - You need help
            
            **No Secrets Policy:**
            - Good surprises (birthday party) = OK 🎉
            - Bad secrets (someone hurting you) = TELL! 🚨
            """,
            "questions": [
                {
                    "id": "q1",
                    "question": "What should you do with a bad secret?",
                    "options": ["Keep it forever", "Tell a trusted adult", "Tell other kids"],
                    "correctAnswer": 1,
                    "explanation": "Always tell a trusted adult about bad secrets! They will help you. 💙"
                }
            ]
        }
    ]

    return {"success": True, "lessons": lessons}

@app.post("/api/learning/submit", response_model=QuizResult)
async def submit_quiz(data: QuizSubmission, current_user = Depends(get_current_user)):
    """Submit quiz answers and get results"""
    # This is a simple implementation - in production, fetch lesson from database
    lessons = await get_lessons()
    lesson = next((l for l in lessons['lessons'] if l['id'] == data.lessonId), None)

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Calculate score
    correct = 0
    total = len(lesson['questions'])

    for i, answer in enumerate(data.answers):
        if i < total and answer == lesson['questions'][i]['correctAnswer']:
            correct += 1

    passed = correct >= (total * 0.7)  # 70% to pass

    return QuizResult(
        success=True,
        score=correct,
        total=total,
        passed=passed
    )

# EMERGENCY ROUTES
@app.post("/api/emergency/alert", response_model=EmergencyResponse)
async def emergency_alert(data: EmergencyAlert, current_user = Depends(get_current_user)):
    """Send emergency alert to parent/trusted contacts"""
    user = get_user_by_id(current_user)

    # Create alert
    alert_id = create_emergency_alert(current_user, data.message, data.location)

    # Get parent if child
    notified = []
    if user['role'] == 'child':
        parent_id = get_parent_of_child(current_user)
        if parent_id:
            parent = get_user_by_id(parent_id)
            notified.append(parent['email'])

    return EmergencyResponse(
        success=True,
        message="Emergency alert sent successfully",
        alertId=alert_id,
        notifiedContacts=notified
    )

@app.get("/api/emergency/alerts")
async def get_alerts(current_user = Depends(get_current_user)):
    """Get emergency alerts (for parents)"""
    user = get_user_by_id(current_user)

    if user['role'] != 'parent':
        raise HTTPException(status_code=403, detail="Only parents can view alerts")

    alerts = get_alerts_for_parent(current_user)

    return {
        "success": True,
        "alerts": [dict(alert) for alert in alerts]
    }

# RESOURCES ROUTES
@app.get("/api/resources", response_model=ResourcesResponse)
async def get_resources():
    """Get curated resources for parents"""
    resources = [
        {
            "id": "r1",
            "title": "National Child Abuse Hotline",
            "description": "24/7 support for child abuse prevention and reporting",
            "url": "1-800-422-4453",
            "category": "Hotline"
        },
        {
            "id": "r2",
            "title": "Talking to Kids About Body Safety",
            "description": "Guide for parents on having age-appropriate conversations",
            "url": "https://www.parenting.org/body-safety",
            "category": "Article"
        },
        {
            "id": "r3",
            "title": "Darkness to Light",
            "description": "Organization dedicated to preventing child sexual abuse",
            "url": "https://www.d2l.org",
            "category": "Organization"
        },
        {
            "id": "r4",
            "title": "RAINN - Rape, Abuse & Incest National Network",
            "description": "Largest anti-sexual violence organization",
            "url": "https://www.rainn.org",
            "category": "Organization"
        },
        {
            "id": "r5",
            "title": "Child Mind Institute",
            "description": "Resources on child psychology and safety",
            "url": "https://childmind.org",
            "category": "Educational"
        },
        {
            "id": "r6",
            "title": "Request Counseling Session",
            "description": "Connect with licensed child safety counselors (Mock)",
            "url": "/api/counseling/request",
            "category": "Counseling"
        }
    ]

    return ResourcesResponse(success=True, resources=resources)

@app.post("/api/counseling/request")
async def request_counseling(current_user = Depends(get_current_user)):
    """Mock endpoint to request professional counseling"""
    return {
        "success": True,
        "message": "Counseling request submitted. A counselor will contact you within 24 hours.",
        "requestId": str(uuid.uuid4())
    }

# HEALTH CHECK
@app.get("/")
async def root():
    return {
        "message": "AwareMe API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
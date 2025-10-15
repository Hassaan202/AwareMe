import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import json
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
    title="SafeNet",
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
async def get_profile(current_user=Depends(get_current_user)):
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


@app.get("/api/profile/children")
async def get_children(current_user=Depends(get_current_user)):
    """Get all linked children profiles for parent"""
    # Verify current user is a parent
    parent = get_user_by_id(current_user)
    if parent['role'] != 'parent':
        raise HTTPException(status_code=403, detail="Only parents can view children profiles")

    # Get all children linked to this parent
    children = get_children_of_parent(current_user)

    # Convert to list of UserResponse objects
    children_profiles = [
        {
            "id": child['id'],
            "email": child['email'],
            "role": child['role'],
            "name": child['name'],
            "age": child['age']
        }
        for child in children
    ]

    return {
        "success": True,
        "count": len(children_profiles),
        "children": children_profiles
    }


@app.post("/api/profile/link-child", response_model=LinkResponse)
async def link_child(data: LinkChildRequest, current_user=Depends(get_current_user)):
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
async def chat_child(data: ChatRequest, current_user=Depends(get_current_user)):
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
async def chat_parent(data: ChatRequest, current_user=Depends(get_current_user)):
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
async def get_lessons_api():
    """Get interactive safety lessons for children from database"""
    # Fetch lessons from database
    lessons_db = get_all_lessons()

    lessons = []
    for lesson in lessons_db:
        # Fetch questions for this lesson
        questions_db = get_questions_by_lesson(lesson['id'])

        questions = []
        for question in questions_db:
            questions.append({
                "id": question['id'],
                "question": question['question'],
                "options": json.loads(question['options']),
                "correctAnswer": question['correct_answer'],
                "explanation": question['explanation']
            })

        lessons.append({
            "id": lesson['id'],
            "title": lesson['title'],
            "description": lesson['description'],
            "content": lesson['content'],
            "questions": questions
        })

    return {"success": True, "lessons": lessons}


@app.post("/api/learning/submit", response_model=QuizResult)
async def submit_quiz(data: QuizSubmission, current_user=Depends(get_current_user)):
    """Submit quiz answers and get results"""
    user = get_user_by_id(current_user)

    # Verify user is a child
    if user['role'] != 'child':
        raise HTTPException(status_code=403, detail="Only children can submit quizzes")

    # Fetch lesson from database
    lesson = get_lesson_by_id(data.lessonId)

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Fetch questions for this lesson
    questions = get_questions_by_lesson(data.lessonId)

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this lesson")

    # Calculate score
    correct = 0
    total = len(questions)

    for i, answer in enumerate(data.answers):
        if i < total and answer == questions[i]['correct_answer']:
            correct += 1

    passed = correct >= (total * 0.7)  # 70% to pass

    # Track student progress in database
    track_student_progress(
        user_id=current_user,
        lesson_id=data.lessonId,
        score=correct,
        total_questions=total,
        passed=passed
    )

    return QuizResult(
        success=True,
        score=correct,
        total=total,
        passed=passed
    )


# EMERGENCY ROUTES
@app.post("/api/emergency/alert", response_model=EmergencyResponse)
async def emergency_alert(data: EmergencyAlert, current_user=Depends(get_current_user)):
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
async def get_alerts(current_user=Depends(get_current_user)):
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
            "title": "UNICEF - Child Protection",
            "description": "Violence, Exploitation & Abuse prevention resources",
            "url": "https://www.unicef.org/child-protection",
            "category": "Organization"
        },
        {
            "id": "r7",
            "title": "WHO - Child Maltreatment",
            "description": "World Health Organization fact sheets on child maltreatment",
            "url": "https://www.who.int/news-room/fact-sheets/detail/child-maltreatment",
            "category": "Educational"
        },
        {
            "id": "r8",
            "title": "ISPCAN",
            "description": "International Society for the Prevention of Child Abuse and Neglect",
            "url": "https://www.ispcan.org/",
            "category": "Organization"
        },
        {
            "id": "r9",
            "title": "Childhelp National Child Abuse Hotline",
            "description": "U.S. national hotline for child abuse support and reporting",
            "url": "https://www.childhelphotline.org/",
            "category": "Hotline"
        },
        {
            "id": "r10",
            "title": "Child Welfare Information Gateway",
            "description": "Comprehensive child welfare resources and information",
            "url": "https://www.childwelfare.gov/",
            "category": "Educational"
        },
        {
            "id": "r11",
            "title": "National Center for Missing & Exploited Children",
            "description": "NCMEC - Resources for missing and exploited children",
            "url": "https://www.missingkids.org/",
            "category": "Organization"
        },
        {
            "id": "r12",
            "title": "Request Counseling Session",
            "description": "Connect with licensed child safety counselors (Mock)",
            "url": "/api/counseling/request",
            "category": "Counseling"
        }
    ]

    return ResourcesResponse(success=True, resources=resources)


@app.post("/api/counseling/request")
async def request_counseling(current_user=Depends(get_current_user)):
    """Mock endpoint to request professional counseling"""
    import uuid
    return {
        "success": True,
        "message": "Counseling request submitted. A counselor will contact you within 24 hours.",
        "requestId": str(uuid.uuid4())
    }


# PROGRESS
@app.get("/api/learning/progress")
async def get_user_progress(current_user=Depends(get_current_user)):
    """Get learning progress for current user"""
    user = get_user_by_id(current_user)

    if user['role'] != 'child':
        raise HTTPException(status_code=403, detail="Only children can view learning progress")

    # Get all progress records for this user from database
    progress_records = get_progress_by_user(current_user)

    # Get all lessons to calculate overall progress
    all_lessons = get_all_lessons()
    total_lessons = len(all_lessons)

    # Convert progress records to list of dicts
    progress_list = []
    completed_lessons = set()

    for record in progress_records:
        progress_list.append({
            'lesson_id': record['lesson_id'],
            'lesson_title': record['title'],
            'lesson_description': record['description'],
            'score': record['score'],
            'total_questions': record['total_questions'],
            'passed': bool(record['passed']),
            'completed_at': record['completed_at']
        })
        if record['passed']:
            completed_lessons.add(record['lesson_id'])

    # Calculate overall statistics
    total_completed = len(completed_lessons)
    completion_percentage = (total_completed / total_lessons * 100) if total_lessons > 0 else 0

    # Calculate total correct answers
    total_correct = sum(p['score'] for p in progress_list)
    total_questions = sum(p['total_questions'] for p in progress_list)
    accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0

    return {
        'success': True,
        'progress': progress_list,
        'statistics': {
            'total_lessons': total_lessons,
            'completed_lessons': total_completed,
            'completion_percentage': round(completion_percentage, 1),
            'total_correct_answers': total_correct,
            'total_questions_attempted': total_questions,
            'accuracy_percentage': round(accuracy, 1)
        }
    }


# PARENT DASHBOARD - View child's progress
@app.get("/api/learning/progress/{child_id}")
async def get_child_progress(child_id: str, current_user=Depends(get_current_user)):
    """Get learning progress for a specific child (parent access only)"""
    user = get_user_by_id(current_user)

    # Verify current user is a parent
    if user['role'] != 'parent':
        raise HTTPException(status_code=403, detail="Only parents can view child progress")

    # Verify the child is linked to this parent
    children = get_children_of_parent(current_user)
    child_ids = [child['id'] for child in children]

    if child_id not in child_ids:
        raise HTTPException(status_code=403, detail="This child is not linked to your account")

    # Get child info
    child = get_user_by_id(child_id)

    # Get progress records for this child
    progress_records = get_progress_by_user(child_id)

    # Get all lessons to calculate overall progress
    all_lessons = get_all_lessons()
    total_lessons = len(all_lessons)

    # Convert progress records to list of dicts
    progress_list = []
    completed_lessons = set()

    for record in progress_records:
        progress_list.append({
            'lesson_id': record['lesson_id'],
            'lesson_title': record['title'],
            'lesson_description': record['description'],
            'score': record['score'],
            'total_questions': record['total_questions'],
            'passed': bool(record['passed']),
            'completed_at': record['completed_at']
        })
        if record['passed']:
            completed_lessons.add(record['lesson_id'])

    # Calculate overall statistics
    total_completed = len(completed_lessons)
    completion_percentage = (total_completed / total_lessons * 100) if total_lessons > 0 else 0

    # Calculate total correct answers
    total_correct = sum(p['score'] for p in progress_list)
    total_questions = sum(p['total_questions'] for p in progress_list)
    accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0

    return {
        'success': True,
        'child': {
            'id': child['id'],
            'name': child['name'],
            'age': child['age']
        },
        'progress': progress_list,
        'statistics': {
            'total_lessons': total_lessons,
            'completed_lessons': total_completed,
            'completion_percentage': round(completion_percentage, 1),
            'total_correct_answers': total_correct,
            'total_questions_attempted': total_questions,
            'accuracy_percentage': round(accuracy, 1)
        }
    }


# HEALTH CHECK
@app.get("/")
async def root():
    return {
        "message": "SafeNet API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
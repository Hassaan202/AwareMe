# SafeNet API Documentation

Version: 1.0.0

Base URL: `http://localhost:8000`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Profile Management](#profile-management)
3. [Chat Services](#chat-services)
4. [Learning & Progress](#learning--progress)
5. [Emergency Services](#emergency-services)
6. [Resources](#resources)
7. [Health Check](#health-check)

---

## Authentication

### Sign Up

**POST** `/api/auth/signup`

Register a new user (parent or child).

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "parent | child",
  "name": "string",
  "age": "number (optional, required for children)"
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "name": "string",
    "age": "number | null"
  },
  "message": "Account created successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error (e.g., missing age for child, email already registered)

---

### Login

**POST** `/api/auth/login`

Login existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "name": "string",
    "age": "number | null"
  },
  "message": "Login successful"
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials

---

## Profile Management

### Get Current User Profile

**GET** `/api/profile`

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "role": "parent | child",
  "name": "string",
  "age": "number | null"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found

---

### Get Children Profiles

**GET** `/api/profile/children`

Get all linked children profiles for parent.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "children": [
    {
      "id": "string",
      "email": "string",
      "role": "child",
      "name": "string",
      "age": 10
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a parent)

---

### Link Child to Parent

**POST** `/api/profile/link-child`

Link a child account to a parent account.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "childEmail": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully linked to {child_name}"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a parent)
- `404` - Child account not found

---

## Chat Services

### Child Chatbot

**POST** `/api/chat/child`

AI-powered chatbot for children with distress detection.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "response": "string",
  "distressDetected": false,
  "timestamp": "2025-10-16T12:00:00.000Z"
}
```

**Features:**
- Context-aware responses for children
- Automatic distress detection
- Creates emergency alerts for parents when distress is detected
- Saves chat history

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a child)

---

### Parent Chatbot

**POST** `/api/chat/parent`

AI-powered guidance chatbot for parents.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "response": "string",
  "distressDetected": false,
  "timestamp": "2025-10-16T12:00:00.000Z"
}
```

**Features:**
- Parenting guidance and advice
- Safety education tips
- Saves chat history

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a parent)

---

## Learning & Progress

### Get All Lessons

**GET** `/api/learning/lessons`

Get all interactive safety lessons with questions.

**Response:**
```json
{
  "success": true,
  "lessons": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "content": "string",
      "questions": [
        {
          "id": "string",
          "question": "string",
          "options": ["string"],
          "correctAnswer": 0,
          "explanation": "string"
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200` - Success

---

### Submit Quiz

**POST** `/api/learning/submit`

Submit quiz answers and get results.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "lessonId": "string",
  "answers": [0, 1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "score": 8,
  "total": 10,
  "passed": true
}
```

**Notes:**
- Passing score is 70% (7/10)
- Progress is automatically tracked in database

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a child)
- `404` - Lesson not found

---

### Get User Progress

**GET** `/api/learning/progress`

Get learning progress for current user (child only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "progress": [
    {
      "lesson_id": "string",
      "lesson_title": "string",
      "lesson_description": "string",
      "score": 8,
      "total_questions": 10,
      "passed": true,
      "completed_at": "2025-10-16T12:00:00.000Z"
    }
  ],
  "statistics": {
    "total_lessons": 10,
    "completed_lessons": 5,
    "completion_percentage": 50.0,
    "total_correct_answers": 40,
    "total_questions_attempted": 50,
    "accuracy_percentage": 80.0
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a child)

---

### Get Child Progress (Parent View)

**GET** `/api/learning/progress/{child_id}`

Get learning progress for a specific child (parent access only).

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `child_id` - The ID of the child

**Response:**
```json
{
  "success": true,
  "child": {
    "id": "string",
    "name": "string",
    "age": 10
  },
  "progress": [
    {
      "lesson_id": "string",
      "lesson_title": "string",
      "lesson_description": "string",
      "score": 8,
      "total_questions": 10,
      "passed": true,
      "completed_at": "2025-10-16T12:00:00.000Z"
    }
  ],
  "statistics": {
    "total_lessons": 10,
    "completed_lessons": 5,
    "completion_percentage": 50.0,
    "total_correct_answers": 40,
    "total_questions_attempted": 50,
    "accuracy_percentage": 80.0
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a parent or child not linked)

---

## Emergency Services

### Send Emergency Alert

**POST** `/api/emergency/alert`

Send emergency alert to parent/trusted contacts.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "message": "string",
  "location": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "alertId": "string",
  "notifiedContacts": ["parent@example.com"]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Get Emergency Alerts

**GET** `/api/emergency/alerts`

Get emergency alerts for parents.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "string",
      "user_id": "string",
      "message": "string",
      "location": "string",
      "created_at": "2025-10-16T12:00:00.000Z",
      "resolved": false
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (user is not a parent)

---

## Resources

### Get Resources

**GET** `/api/resources`

Get curated resources and hotlines for parents.

**Response:**
```json
{
  "success": true,
  "resources": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "category": "Hotline | Article | Organization | Educational | Counseling"
    }
  ]
}
```

**Available Resources:**
- National Child Abuse Hotline
- Talking to Kids About Body Safety
- Darkness to Light
- RAINN
- Child Mind Institute
- UNICEF - Child Protection
- WHO - Child Maltreatment
- ISPCAN
- Childhelp National Child Abuse Hotline
- Child Welfare Information Gateway
- National Center for Missing & Exploited Children
- Professional Counseling Request

**Status Codes:**
- `200` - Success

---

### Request Counseling

**POST** `/api/counseling/request`

Request professional counseling session (mock endpoint).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Counseling request submitted. A counselor will contact you within 24 hours.",
  "requestId": "string"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

## Health Check

### Root Endpoint

**GET** `/`

Check API status and get basic information.

**Response:**
```json
{
  "message": "SafeNet API is running",
  "version": "1.0.0",
  "docs": "/docs"
}
```

**Status Codes:**
- `200` - Success

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

Get a token by calling the `/api/auth/signup` or `/api/auth/login` endpoints.

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Error message describing the validation issue"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Permission denied message"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Interactive API Documentation

FastAPI provides interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## CORS Configuration

The API allows cross-origin requests from:
- `http://localhost:3000` (Next.js default)
- `http://localhost:5173` (Vite default)

All methods and headers are allowed for these origins.

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production.

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The API uses SQLite for data persistence
- AI features use Google Gemini or HuggingFace models
- Emergency alerts automatically notify linked parents
- Chat distress detection triggers automatic emergency alerts
- Quiz passing score is 70%
- Parent-child linking is one-way (parents can view child data)


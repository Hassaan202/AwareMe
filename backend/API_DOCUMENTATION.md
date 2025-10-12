# AwareMe Backend API Documentation

## 📚 Overview

AwareMe is a child safety education platform with AI-powered chatbots for both children and parents. The backend provides RESTful APIs for authentication, chat interactions, learning modules, emergency alerts, and safety resources.

**Base URL:** `http://localhost:8000`  
**API Documentation:** `http://localhost:8000/docs` (Swagger UI)  
**Alternative Docs:** `http://localhost:8000/redoc`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### POST `/api/auth/signup`
Register a new user (parent or child).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "role": "parent",  // or "child"
  "name": "John Doe",
  "age": 10  // Required only for children
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "parent",
    "name": "John Doe",
    "age": null
  },
  "message": "Account created successfully"
}
```

**Notes:**
- Creates a new session automatically
- Password must be at least 6 characters
- Role must be either "parent" or "child"
- Age is required for child accounts

---

### POST `/api/auth/login`
Login existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "parent",
    "name": "John Doe",
    "age": null
  },
  "message": "Login successful"
}
```

**Notes:**
- Creates a new session on each login
- Previous session chat history is isolated
- Token expires in 7 days

---

### POST `/api/auth/logout`
Logout and clear current session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Notes:**
- Deletes current session from database
- Chat history remains for analytics but won't be shared with new sessions

---

## 👤 Profile Management

### GET `/api/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "role": "parent",
  "name": "John Doe",
  "age": null
}
```

---

### GET `/api/profile/children`
Get all linked children profiles (parents only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "children": [
    {
      "id": "child-uuid-1",
      "email": "child1@example.com",
      "role": "child",
      "name": "Emma Doe",
      "age": 10
    },
    {
      "id": "child-uuid-2",
      "email": "child2@example.com",
      "role": "child",
      "name": "Liam Doe",
      "age": 8
    }
  ]
}
```

**Error (403):** If user is not a parent

---

### POST `/api/profile/link-child`
Link a child account to parent account.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "childEmail": "child@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully linked to Emma Doe"
}
```

**Notes:**
- Only parents can link children
- Child account must already exist
- Parent will receive emergency alerts from linked children

---

## 💬 Chat Endpoints (AI-Powered)

### POST `/api/chat/child`
Child-friendly chatbot with safety education.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "What is good touch and bad touch?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Great question! 🌟 Good touch is when someone you trust, like your mom or dad, gives you a hug or high-five...",
  "distressDetected": false,
  "timestamp": "2025-10-13T10:30:00.000Z"
}
```

**Features:**
- Uses child's age for age-appropriate responses
- Remembers conversation within current session
- Detects distress keywords (hurt, scared, uncomfortable, etc.)
- Auto-alerts linked parent if distress detected
- Child-friendly language with emojis

**Distress Keywords:** hurt, uncomfortable, scared, touched, secret, help, afraid

---

### POST `/api/chat/parent`
Parent guidance chatbot with expert advice.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "How do I talk to my 8-year-old about body safety?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Here's a practical approach for talking to your 8-year-old about body safety...",
  "distressDetected": false,
  "timestamp": "2025-10-13T10:30:00.000Z"
}
```

**Features:**
- Expert guidance on child safety topics
- Remembers conversation within current session
- Uses RAG (Retrieval Augmented Generation) with authoritative sources
- Provides actionable steps and practical advice
- Non-judgmental and supportive tone

---

## 📚 Learning Modules

### GET `/api/learning/lessons`
Get all interactive safety lessons for children.

**Response:**
```json
{
  "success": true,
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Good Touch, Bad Touch 🤗",
      "description": "Learn about safe and unsafe touches",
      "content": "**What is Good Touch?**\n- Hugs from people you trust...",
      "questions": [
        {
          "id": "q1",
          "question": "Which is a good touch?",
          "options": ["A hug from mom", "Someone touching private parts", "Being forced to kiss someone"],
          "correctAnswer": 0,
          "explanation": "Hugs from trusted family members are good touches! 🤗"
        }
      ]
    }
  ]
}
```

**Available Lessons:**
1. **Good Touch, Bad Touch** - Understanding safe and unsafe touches
2. **My Body, My Rules** - Body autonomy and consent
3. **Trusted Adults** - Who to talk to when you need help

---

### POST `/api/learning/submit`
Submit quiz answers and get results.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "lessonId": "lesson-1",
  "answers": [0, 1]  // Array of selected answer indices
}
```

**Response:**
```json
{
  "success": true,
  "score": 2,
  "total": 2,
  "passed": true  // 70% or higher to pass
}
```

---

## 🚨 Emergency Alerts

### POST `/api/emergency/alert`
Send emergency alert to parent/trusted contacts.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I need help!",
  "location": "At home"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "alertId": "alert-uuid",
  "notifiedContacts": ["parent@example.com"]
}
```

**Notes:**
- Automatically notifies linked parent(s)
- Location is optional but recommended
- Alert is stored in database for parent review

---

### GET `/api/emergency/alerts`
Get all emergency alerts from linked children (parents only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "alert-uuid",
      "user_id": "child-uuid",
      "message": "Distress detected in chat: I feel uncomfortable...",
      "location": "Chat conversation",
      "created_at": "2025-10-13T10:30:00.000Z"
    }
  ]
}
```

**Error (403):** If user is not a parent

---

## 📖 Resources

### GET `/api/resources`
Get curated child safety resources.

**Response:**
```json
{
  "success": true,
  "resources": [
    {
      "id": "r1",
      "title": "National Child Abuse Hotline",
      "description": "24/7 support for child abuse prevention and reporting",
      "url": "1-800-422-4453",
      "category": "Hotline"
    },
    {
      "id": "r6",
      "title": "UNICEF - Child Protection",
      "description": "Violence, Exploitation & Abuse prevention resources",
      "url": "https://www.unicef.org/child-protection",
      "category": "Organization"
    }
  ]
}
```

**Resource Categories:**
- **Hotline** - Emergency phone numbers
- **Organization** - Child safety organizations
- **Educational** - Articles and fact sheets
- **Article** - Specific guides
- **Counseling** - Professional counseling services

**Included Resources:**
1. National Child Abuse Hotline
2. Talking to Kids About Body Safety
3. Darkness to Light
4. RAINN
5. Child Mind Institute
6. UNICEF - Child Protection
7. WHO - Child Maltreatment
8. ISPCAN
9. Childhelp National Child Abuse Hotline
10. Child Welfare Information Gateway
11. National Center for Missing & Exploited Children (NCMEC)
12. Request Counseling Session (Mock)

---

### POST `/api/counseling/request`
Request professional counseling session (Mock endpoint).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Counseling request submitted. A counselor will contact you within 24 hours.",
  "requestId": "request-uuid"
}
```

---

## 🏥 Health Check

### GET `/`
Check API health status.

**Response:**
```json
{
  "message": "AwareMe API is running",
  "version": "1.0.0",
  "docs": "/docs"
}
```

---

## 🔑 Key Features

### Session-Based Chat History
- **Context Preservation**: AI remembers conversations within the same login session
- **Session Isolation**: Each login creates a new session with fresh context
- **History Limit**: Last 10 messages used to prevent token overflow
- **Privacy**: Previous sessions are not shared with new logins

### Distress Detection
- Monitors child chat for distress keywords
- Automatically creates emergency alert for linked parents
- Suggests contacting trusted adults
- Stores context in alert for parent review

### Role-Based Access Control
- **Parent-only endpoints**: `/api/profile/children`, `/api/emergency/alerts`
- **Child-only endpoints**: Child chatbot (enforced at endpoint level)
- **Parent-only features**: Linking children, viewing alerts, counseling requests

---

## 📊 Database Schema

### Tables:
1. **users** - User accounts (parents and children)
2. **user_sessions** - Active login sessions
3. **parent_child_links** - Parent-child relationships
4. **emergency_alerts** - Emergency alerts from children
5. **chat_history** - Chat conversation history

---

## 🛠️ Error Handling

### Standard Error Response:
```json
{
  "detail": "Error message here"
}
```

### Common HTTP Status Codes:
- **200 OK** - Success
- **401 Unauthorized** - Invalid or missing JWT token
- **403 Forbidden** - Insufficient permissions (wrong role)
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation error

---

## 🧪 Example Usage Flow

### 1. Parent Registration & Setup
```bash
# 1. Register parent
POST /api/auth/signup
{
  "email": "parent@example.com",
  "password": "secure123",
  "role": "parent",
  "name": "Jane Doe"
}

# 2. Get profile
GET /api/profile
Authorization: Bearer <token>

# 3. Link child
POST /api/profile/link-child
{
  "childEmail": "child@example.com"
}

# 4. Chat with parent bot
POST /api/chat/parent
{
  "message": "How do I teach my child about consent?"
}
```

### 2. Child Interaction
```bash
# 1. Register/Login child
POST /api/auth/login
{
  "email": "child@example.com",
  "password": "childsecure"
}

# 2. Chat with child bot
POST /api/chat/child
{
  "message": "What should I do if someone makes me uncomfortable?"
}

# 3. Get lessons
GET /api/learning/lessons

# 4. Submit quiz
POST /api/learning/submit
{
  "lessonId": "lesson-1",
  "answers": [0, 1]
}

# 5. Emergency alert
POST /api/emergency/alert
{
  "message": "I need help!",
  "location": "At school"
}
```

### 3. Parent Monitoring
```bash
# 1. View linked children
GET /api/profile/children

# 2. Check emergency alerts
GET /api/emergency/alerts

# 3. Get safety resources
GET /api/resources
```

---

## 🚀 Tech Stack

- **Framework**: FastAPI 0.109.0
- **Authentication**: JWT (PyJWT, python-jose)
- **Password Hashing**: bcrypt via passlib
- **Database**: SQLite (contextmanager pattern)
- **AI Models**: 
  - Google Gemini (gemini-pro) - Primary
  - HuggingFace (Mistral-7B) - Alternative
- **LangChain**: Conversation management and RAG
- **Vector Store**: ChromaDB with HuggingFace embeddings
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Web Scraping**: BeautifulSoup4 for RAG data collection

---

## 🔧 Configuration

### Environment Variables:
```bash
# AI Model Provider
MODEL_PROVIDER=gemini  # or "huggingface"

# API Keys
GEMINI_API_KEY=your-gemini-api-key
HUGGINGFACE_API_KEY=your-hf-api-key
```

### Default Settings:
- **JWT Expiration**: 7 days
- **Secret Key**: `awareme-mvp-secret-key-2024` (MVP only - change in production)
- **Database**: `app.db` (SQLite)
- **Vector Store**: `./vectorstore` (ChromaDB)
- **CORS Origins**: `http://localhost:3000`, `http://localhost:5173`

---

## 📝 Notes

### For Production:
1. ⚠️ Change SECRET_KEY in `auth.py`
2. Use environment variables for all secrets
3. Enable HTTPS
4. Add rate limiting
5. Use PostgreSQL instead of SQLite
6. Implement proper logging and monitoring
7. Add input sanitization and validation
8. Set up proper CORS origins
9. Implement refresh tokens
10. Add API versioning

### RAG Data Sources:
The parent chatbot uses RAG with content from:
- UTMB - Good Touch and Bad Touch
- NCBI - Child Safety Research
- UNICEF - Child Protection
- WHO - Child Maltreatment
- ISPCAN
- Childhelp
- Child Welfare Gateway
- Missing Kids (NCMEC)

---

## 📞 Support

For API issues or questions:
- Check `/docs` for interactive testing
- Review error messages in responses
- Ensure JWT token is valid and not expired
- Verify user role matches endpoint requirements

---

**Last Updated:** October 13, 2025  
**API Version:** 1.0.0  
**Documentation Version:** 1.0


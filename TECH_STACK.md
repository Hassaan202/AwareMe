# SafeNet - Technical Stack & Features

## Technology Stack

### Frontend

#### Core Framework
- **Next.js** - React framework with App Router
- **React** - UI library
- **React DOM** - React renderer for web

#### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Lucide React** - Modern icon library

#### Utilities
- **JavaScript/JSX** - Frontend programming
- **Next.js App Router** - File-based routing system
- **Client-side Storage** - LocalStorage for auth tokens and user data

---

### Backend

#### Core Framework
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server for FastAPI
- **Python 3.10+** - Backend programming language

#### Data Validation & Models
- **Pydantic** - Data validation and serialization
- **Pydantic Settings** - Configuration management

#### Authentication & Security
- **python-jose** - JWT token handling
- **PyJWT** - JSON Web Token implementation
- **Passlib** - Password hashing library
- **Bcrypt** - Secure password hashing algorithm
- **python-multipart** - Form data and file upload handling

#### Database
- **SQLite3** - Lightweight relational database
- **Custom ORM** - Direct SQL queries with context managers

---

### AI & Machine Learning

#### LangChain Ecosystem
- **LangChain** - Framework for LLM applications
- **LangChain Core** - Core LangChain components
- **LangChain Community** - Community integrations and tools

#### AI Model Providers
- **Google Gemini (Primary)**
  - `langchain-google-genai` - LangChain integration
  - `google-generativeai` - Google AI SDK
  - Model: `gemini-2.5-flash-lite`
  
- **HuggingFace (Alternative)**
  - `langchain-huggingface` - LangChain integration
  - `huggingface-hub` - Model repository access

#### RAG (Retrieval Augmented Generation)
- **ChromaDB** - Vector database for embeddings
- **Sentence Transformers** - Text embedding models
- **HuggingFace Embeddings** - Pre-trained embedding models

#### Web Scraping for Knowledge Base
- **BeautifulSoup4** - HTML/XML parsing
- **lxml** - Fast XML/HTML processing
- **Requests** - HTTP library for fetching content

---

### Development Tools

#### Frontend Development
- **ESLint** - JavaScript linting
- **Next.js Dev Tools** - Hot module replacement
- **Turbopack** - Fast bundler (Next.js 15+)

#### Backend Development
- **python-dotenv** - Environment variable management
- **FastAPI Auto-docs** - Swagger UI and ReDoc
- **Uvicorn reload** - Hot reload for development
 
---

## Core Features

### 1. Authentication & Authorization
- **User Registration** - Email-based signup for parents and children
- **Role-Based Access Control** - Separate permissions for parents and children

### 2. AI Chatbot System

#### Child Chatbot ("SafeMigo")
- **Friendly Interface** - Child-appropriate language and tone
- **Safety Education** - Interactive learning conversations
- **Distress Detection** - AI identifies concerning messages and alerts parents

#### Parent Chatbot ("Parent Assistant")
- **Parenting Guidance** - Expert advice on child safety
- **Context-Aware Responses** - RAG-enhanced knowledge base with data from reliable sources
- **Resource Recommendations** - Curated safety resources

### 3. Interactive Learning System

#### Game-Based Learning
- **Body Safety Game** - Interactive clickable body diagram
- **Color-Coded Zones** - Visual learning (green/yellow/red)
- **Zone Information** - Detailed explanations for each body part
- **Engaging UI** - Animations and interactive elements

#### Structured Lessons
- **Multiple Lessons** - Various safety topics
- **Interactive Quizzes** - Multiple-choice questions
- **Instant Feedback** - Real-time answer validation
- **Pass/Fail System** - 70% threshold for completion

### 4. Progress Tracking & Analytics

#### Child Dashboard
- **Personal Progress** - Individual lesson completion
- **Achievement Levels** - Dynamic badges based on performance
  - Master Learner (90%+)
  - Advanced Learner (70%+)
  - Growing Learner (50%+)
  - Rising Learner (30%+)
  - Beginning Learner (<30%)
- **Detailed Statistics** - Completion rates and accuracy
- **Learning History** - Timeline of completed lessons

#### Parent Dashboard
- **Child Progress Overview** - Monitor all linked children
- **Detailed Analytics** - Per-child statistics
- **Lesson-Level Details** - Individual quiz scores
- **Activity Timeline** - Chronological learning history

### 5. Emergency & Safety Features

#### Emergency Alert System
- **Quick Access Button** - Floating emergency button for children
- **Custom Messages** - Describe the situation
- **Location Sharing** - location information shared
- **Parent Notifications** - Instant alerts to linked parents
- **Distress Detection** - AI monitoring in chat conversations

#### Safety Resources
- **Hotlines Database** - Emergency contact numbers
- **Educational Articles** - Safety guides and tips
- **Organization Links** - Child protection organizations
- **Counseling Requests** - Connect with professionals

### 6. User Interface Features

#### Visual Design
- **Responsive Design** - Mobile and desktop optimized
- **Smooth Animations** - Transitions and hover effects
- **Accessible UI** - Screen reader friendly
- **Gamified UI** - child-friendly interface

### 7. Data Management

#### Profile Management
- **User Profiles** - View and manage account information
- **Parent-Child Linking** - Connect family accounts

### 8. Content Management

#### Lesson System
- **Pre-loaded Lessons** - Database-driven content
- **Dynamic Questions** - Randomizable quiz order

#### Resource Library
- **Curated Content** - Vetted safety resources
- **Multiple Categories** - Hotlines, articles, organizations
- **External Links** - Direct access to help services
- **Regular Updates** - Expandable resource database

---

## Future Enhancements

1. **Real-time Notifications** - WebSocket support
2. **Multi-language Support** - Internationalization
3. **Mobile Apps** - React Native versions
4. **Advanced Analytics** - ML-based insights
5. **Video Content** - Interactive safety videos
6. **Gamification** - Points, badges, and leaderboards
7. **Social Features** - Peer learning (moderated)
8. **Admin Dashboard** - Content management system


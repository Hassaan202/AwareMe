# SafeNet

AI-powered child safety education platform with role-based experiences for parents and children, featuring interactive lessons, AI chatbots, and progress tracking.

---

## Project Structure

```
SafeNet/
├─ backend/               # FastAPI backend service
│  ├─ main.py             # API routes and endpoints
│  ├─ auth.py             # JWT authentication
│  ├─ database.py         # SQLite database operations
│  ├─ models.py           # Pydantic data models
│  ├─ ai_integration.py   # AI chatbot integration
│  ├─ build_vector_db.py  # Vector database builder for RAG
│  └─ requirements.txt    # Python dependencies
└─ frontend/              # Next.js frontend application
   └─ app/                # App router pages and components
```

---

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

pip install -r requirements.txt

# Set environment variables
export MODEL_PROVIDER=gemini
export GEMINI_API_KEY=your-api-key

# Run the server
python main.py
```

API will be available at `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm install lucide-react-native
npm run dev
```

App will be available at `http://localhost:3000`

---

## Environment Variables

**Backend:**
- `MODEL_PROVIDER` - AI provider (gemini or huggingface)
- `GEMINI_API_KEY` - Google Gemini API key
- `HUGGINGFACE_API_KEY` - HuggingFace API key (optional)

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

---

## Key Features

- **Role-Based Access**: Separate interfaces for parents and children
- **AI Chatbots**: Context-aware assistants for both roles
- **Interactive Learning**: Gamified safety lessons with quizzes
- **Progress Tracking**: Real-time monitoring of child's learning progress
- **Emergency Alerts**: Quick access to help and parent notifications
- **Resource Library**: Curated safety resources and hotlines

---

## Tech Stack

See `TECH_STACK.md` for detailed technical information.

---

## License

MIT License - See `LICENSE` file for details.

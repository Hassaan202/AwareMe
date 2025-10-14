# AwareMe

AI-powered child safety education platform with role-based (Parent/Child) experiences, interactive lessons, and chatbots. The project includes a FastAPI backend and a Next.js frontend.

---

## Monorepo Structure

```
AwareMe/
├─ backend/               # FastAPI service (auth, chat, learning, emergency, resources)
│  ├─ main.py             # App entrypoint and routes
│  ├─ auth.py             # JWT auth utilities
│  ├─ database.py         # SQLite helpers
│  ├─ models.py           # Pydantic models
│  ├─ ai_integration.py   # AI providers & RAG glue
│  ├─ build_vector_db.py  # (Optional) Build embeddings/vector store for RAG
│  ├─ API_DOCUMENTATION.md# Detailed API reference
│  └─ requirements.txt    # Python deps
└─ frontend/              # Next.js app (role-based UI for parent/child)
   └─ app/                # App Router pages/components
```

---

## Tech Stack

- Backend: FastAPI, Pydantic v2, JWT (python-jose/PyJWT), SQLite, ChromaDB, LangChain
- Frontend: Next.js 15, React 19, Tailwind CSS 4

---

## Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10 (recommended 3.11)
- Git

---

## Quick Start

### 1) Clone

```bash
git clone <your-repo-url>
cd AwareMe
```

### 2) Backend (API)

```bash
cd backend
python -m venv .venv
# Windows PowerShell
. .venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

Set environment variables (examples):

- PowerShell
```powershell
$env:MODEL_PROVIDER = "gemini"   # or "huggingface"
$env:GEMINI_API_KEY = "your-gemini-api-key"
$env:HUGGINGFACE_API_KEY = "your-hf-api-key"
```

- bash/zsh
```bash
export MODEL_PROVIDER=gemini   # or "huggingface"
export GEMINI_API_KEY=your-gemini-api-key
export HUGGINGFACE_API_KEY=your-hf-api-key
```

Run the API:

```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Optional: build vector DB for RAG sources:

```bash
python build_vector_db.py
```

### 3) Frontend (Web)

```bash
cd ../frontend
npm install
npm run dev
```

- App: `http://localhost:3000`

If your API runs elsewhere, set the frontend to point at it (e.g., `.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Configuration

See `backend/API_DOCUMENTATION.md` for detailed backend configuration. Key environment variables:

- `MODEL_PROVIDER` = `gemini` | `huggingface`
- `GEMINI_API_KEY`
- `HUGGINGFACE_API_KEY`
- Frontend: `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:8000`)

Defaults (backend):
- JWT expiration: 7 days
- SQLite DB: `app.db`
- Vector store: `./vectorstore`
- CORS: `http://localhost:3000`, `http://localhost:5173`

---

## Developing

- Backend hot-reload: `uvicorn main:app --reload`
- Frontend dev: `npm run dev`
- Lint (web): `npm run lint`

Common edits:
- Update allowed CORS origins in `backend/main.py` when changing frontend host/port
- Add new routes in `backend/main.py` and corresponding types in `backend/models.py`

---

## API Reference

- Live docs at runtime: `http://localhost:8000/docs`
- In-repo guide: `backend/API_DOCUMENTATION.md`

Includes endpoints for:
- Authentication (`/api/auth/signup`, `/api/auth/login`)
- Profiles and parent/child linking
- AI chat for child and parent
- Learning lessons and quiz submission
- Emergency alerts
- Curated resources

---

## Troubleshooting

- Port already in use: change `--port` for backend or `NEXT_PORT` for frontend
- CORS errors: add your frontend origin in `backend/main.py` CORS config
- Missing vector store: run `build_vector_db.py` (optional)
- Invalid JWT: ensure Authorization header is `Bearer <token>`

---

## License

This project is licensed under the terms of the MIT License. See `LICENSE`.

---

## Acknowledgments

This MVP references public child-safety resources (UNICEF, WHO, NCMEC, etc.) for non-commercial educational purposes. See `backend/API_DOCUMENTATION.md` for more details.

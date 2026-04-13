# VivaMind AI Interview Platform

VivaMind is a MERN-style interview preparation platform with AI-assisted learning, coding practice, adaptive interviews, analytics, and resume-to-job matching.

## What This Project Includes

- React + Vite frontend with protected routes and role-aware UI
- Node.js + Express backend API
- MongoDB persistence via Mongoose
- JWT authentication (email/password)
- Google sign-in via Firebase client + Firebase Admin verification
- OpenRouter-powered AI workflows for:
  - topic teaching
  - question generation and answer evaluation
  - adaptive interview loops
  - AI coding problem generation and code review
  - resume/JD compatibility analysis

## Core Features

- Auth:
  - Register/login with JWT
  - Google login through Firebase token verification
  - Current-user endpoint for session restore
- Learn Mode:
  - Generate structured lessons by topic and level
- Practice Mode:
  - Generate single technical questions
  - Submit answers and receive scored feedback
  - Store attempts for analytics
- Adaptive Mode:
  - Multi-question adaptive interview sessions
  - Difficulty shifts based on score
  - Final summary report with per-question breakdown
- DSA Practice Tracker:
  - Admin adds topic problems
  - Users update problem status (NotStarted, Attempted, Solved)
  - Topic-wise progress summary
- AI Coding Practice:
  - Generate coding tasks with constraints/examples/boilerplate
  - Submit code for verdict, complexity, issues, and improvements
- Resume Match:
  - Analyze resume and job description from text and/or PDF uploads
  - Return skill gaps, suggested topics, and ATS-like score
- Dashboard Analytics:
  - Practice/adaptive counts
  - Average scores and topic performance chart

## Tech Stack

Frontend:

- React 19
- Vite 7
- Tailwind CSS
- React Router
- Axios
- Recharts
- Firebase (client auth)

Backend:

- Express 5
- Mongoose
- JWT + bcryptjs
- Firebase Admin
- Multer + pdf-parse
- node-fetch

AI Integrations:

- OpenRouter Chat Completions API

## Project Structure

```text
ai-interview-platform/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    firebaseAdmin.js
    server.js
  frontend/
    src/
      api/
      components/
      context/
      layout/
      pages/
      services/
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- OpenRouter API key
- Firebase project (for Google login)

## Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=mistralai/mistral-7b-instruct

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Notes:

- `FIREBASE_PRIVATE_KEY` must preserve newline escapes (`\n`) exactly as shown.
- If Firebase Admin variables are missing, Google login verification on backend will not work.

## Local Setup

1. Install root dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Run backend (terminal 1):

```bash
cd backend
npm run dev
```

5. Run frontend (terminal 2):

```bash
cd frontend
npm run dev
```

6. Open frontend in browser:

```text
http://localhost:5173
```

## API Overview

Base URL: `http://localhost:5000/api`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google-firebase`
- `GET /auth/me` (protected)

Learn:

- `POST /learn/topic` (protected)

Interview:

- `POST /interview/generate` (protected)
- `POST /interview/evaluate` (protected)
- `GET /interview/history` (protected)
- `POST /interview/resume-match` (protected)
- `POST /interview/resume-match-upload` (protected, multipart)

Adaptive:

- `POST /adaptive/start` (protected)
- `POST /adaptive/answer` (protected)

Practice:

- `POST /practice/problems` (protected + admin)
- `GET /practice/problems?topic=<topic>` (protected)
- `POST /practice/update-status` (protected)
- `GET /practice/progress-summary` (protected)
- `POST /practice/ai/generate-coding` (protected)
- `POST /practice/ai/evaluate-coding` (protected)

Analytics:

- `GET /analytics` (protected)

## Data Models (High-Level)

- User: name, email, password, role
- Attempt: userId, topic, question, answer, score, feedback
- InterviewSession: adaptive session state, question history, score totals
- Problem: title, topic, difficulty, link, order
- UserProgress: userId + problemId + status (unique composite index)

## Admin Access

`/practice/problems` requires `role: admin`.

The current register flow creates `role: user` by default. To create an admin, update a user role directly in MongoDB:

```js
// Example in MongoDB shell
// db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Current Notes

- Root `package.json` currently only includes shared dependencies and no run scripts.
- `frontend/src/services/practiceService.js` uses a hardcoded backend URL (`http://localhost:5000/api`), while `frontend/src/api/axios.js` supports `VITE_API_URL`.

## Future Improvements

- Add root-level scripts (concurrently) for one-command startup
- Add request validation (zod/joi) and central error middleware
- Add tests for controllers and auth middleware
- Normalize frontend API usage through a single axios client
- Add Docker Compose for reproducible local setup

## License

No license file is currently present.

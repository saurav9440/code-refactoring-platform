# 🚀 AI Code Refactoring Studio

A full-stack, real-time AI coding assistant that analyzes, scores, and refactors your code using state-of-the-art Large Language Models.

## 🌟 Features
- **Live Code Editor:** Integrated Monaco Editor with syntax highlighting for JavaScript, Python, and Java.
- **AI Code Analysis:** Connects to the Groq LLM API to detect deeply nested loops, unused variables, and inefficient patterns.
- **Dynamic Scoring:** Visual "Score Ring" calculates code quality from 0 to 100.
- **Instant Refactoring:** Generates clean, optimized, and modern replacement code in real-time.
- **Real-Time Streaming:** Uses WebSockets to stream the AI's analysis steps instantly to the UI.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS (v3), Monaco Editor, Socket.io-client
- **Backend:** Node.js, Express, Socket.io, Groq SDK
- **Architecture:** Monorepo design, fully containerized with Docker

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- A free [Groq API Key](https://console.groq.com/keys)

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd ai-full-stack-project
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Next, create an environment file. Copy the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
Open the new `.env` file and paste your Groq API key:
```env
PORT=5000
GROQ_API_KEY=gsk_your_actual_api_key_here
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the Application
Navigate to `http://localhost:5173` in your browser. Paste some messy code, hit **Refactor Now**, and watch the AI work its magic!

## 🐳 Docker Deployment
If you prefer Docker, you can spin up the entire stack with one command:
```bash
docker-compose up --build
```<img width="1918" height="900" alt="Screenshot 2026-04-28 213057" src="https://github.com/user-attachments/assets/b416970c-73ff-4c97-a450-4ae7c23fee28" />
<img width="1919" height="896" alt="Screenshot 2026-04-28 213038" src="https://github.com/user-attachments/assets/c5108f03-1ecb-4735-9f0b-97efd399c75d" />


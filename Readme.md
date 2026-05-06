# Github Sagemaker AI 🧠⚡

AI-powered GitHub repository analyzer with codebase explanation, debugging assistance, and file-level chat.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS + React Flow
- **Backend**: Node.js + Express + OpenAI API + GitHub REST API
- **Database**: MongoDB

## Setup

### 1. Environment Variables

```bash
# server/.env
OPENAI_API_KEY=sk-your-openai-api-key
GITHUB_TOKEN=ghp_your-github-token
MONGO_URI=mongodb://localhost:27017/githubsage
PORT=5000
```

```bash
# client/.env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Start MongoDB

```bash
mongod
```

### 4. Run

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze-repo` | Analyze a GitHub repo (structure, tech stack, AI summary) |
| POST | `/api/explain-code` | Explain a specific file |
| POST | `/api/debug` | Debug an error with AI suggestions |
| POST | `/api/chat-file` | Chat about a file with context |

## Project Structure

```
/server
  /controllers    - Request handlers
  /models         - MongoDB schemas (Repo, ChatHistory)
  /routes         - Express routes
  /services       - GitHub API, OpenAI, file parser
  /utils          - Prompts, text chunker
  index.js        - Server entry point

/client
  /src
    /components   - Navbar, FileTree, CodeViewer, GraphView
    /pages        - Home, Dashboard, Debug, FileChat
    /utils        - API client, helpers
    App.jsx       - Root component with routing
```
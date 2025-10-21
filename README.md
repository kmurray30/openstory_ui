# OpenStory UI

An AI-powered interactive storytelling platform where users can play different story-based games by chatting with AI. Each game has its own unique context and personality, powered by OpenAI's GPT models.

## 🎮 Features

- **Multiple Game Scenarios**: Choose from different story genres (Fantasy, Detective, Sci-Fi)
- **AI-Powered Conversations**: Real-time chat with context-aware AI storytellers
- **Persistent Sessions**: Your conversation history is saved per game
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Full-Stack TypeScript**: Type safety across frontend and backend
- **Comprehensive Testing**: Full test coverage for both frontend and backend

## 🏗️ Project Structure

```
openstory_ui/
├── client/              # React frontend (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Home, Chat)
│   │   ├── services/    # API client
│   │   └── test/        # Test utilities
│   └── package.json
├── server/              # Express backend (TypeScript + OpenAI)
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic (OpenAI integration)
│   │   ├── utils/       # Utility functions (file storage, games loader)
│   │   └── __tests__/   # Backend tests
│   ├── games.json       # Game configurations
│   └── package.json
├── shared/              # Shared TypeScript types
│   └── types.ts
└── user_data/           # File-based chat history storage (gitignored)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd openstory_ui
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   cd ..
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server/` directory:
   ```bash
   cd server
   touch .env
   ```

   Add the following content to `server/.env`:
   ```env
   # REQUIRED: Your OpenAI API key
   OPENAI_API_KEY=sk-your-api-key-here

   # Server port (default: 3001)
   PORT=3001

   # Session secret (change in production)
   SESSION_SECRET=your-random-session-secret-change-in-production
   ```

   **⚠️ IMPORTANT**: Replace `sk-your-api-key-here` with your actual OpenAI API key!

### Running the Application

You need to run both the backend and frontend servers:

#### Option 1: Using separate terminals (Recommended for development)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

#### Option 2: Using the root scripts

From the project root:
```bash
# Start backend (in one terminal)
npm run server

# Start frontend (in another terminal)
npm run client
```

### Accessing the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the OpenStory home page with three game options!

## 🧪 Running Tests

### Backend Tests

```bash
cd server
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
cd client
npm test

# Run tests with UI
npm run test:ui
```

### Run All Tests

From the project root:
```bash
npm test
```

## 📝 How It Works

### Backend Architecture

1. **Express Server** (`server/src/index.ts`)
   - Handles HTTP requests
   - Manages user sessions with cookies
   - Serves API endpoints

2. **Session Management**
   - Each user gets a unique session ID (stored in a cookie)
   - Session persists for 30 days
   - Chat history is saved per session + game combination

3. **File Storage** (`server/src/utils/fileStorage.ts`)
   - Chat histories stored as JSON files
   - Structure: `user_data/{sessionId}/{gameId}/chat.json`
   - Survives server restarts

4. **OpenAI Integration** (`server/src/services/openai.ts`)
   - Calls OpenAI's Chat Completion API
   - Includes system prompt (game context) + chat history
   - Uses GPT-3.5-turbo by default (can switch to GPT-4)

### Frontend Architecture

1. **React Router**
   - `/` - Home page (game selection)
   - `/game/:gameId` - Chat interface for specific game

2. **State Management**
   - Local component state with React hooks
   - No Redux needed for this scope

3. **API Client** (`client/src/services/api.ts`)
   - Typed fetch calls to backend
   - Includes cookies for session management

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | Get all available games |
| GET | `/api/chat/:gameId` | Get chat history for a game |
| POST | `/api/chat/:gameId` | Send a message and get AI response |
| GET | `/health` | Health check endpoint |

## 🎨 Adding New Games

To add a new game, edit `server/games.json`:

```json
{
  "id": "your-game-id",
  "name": "Your Game Name",
  "description": "A brief description shown on the home page",
  "systemPrompt": "The AI's personality and context for this game",
  "thumbnailUrl": "https://example.com/image.jpg"
}
```

The server will automatically load the new game on restart!

## 🚢 Deployment

### Deploying the Backend (Heroku)

1. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your-api-key
   heroku config:set SESSION_SECRET=your-random-secret
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **Note the backend URL** (e.g., `https://your-app-name.herokuapp.com`)

### Deploying the Frontend

The frontend can be deployed to any static hosting service. You'll need to:

1. Update the API proxy in production (or use absolute URLs)
2. Build the frontend: `cd client && npm run build`
3. Deploy the `client/dist` folder

**Note**: Since you mentioned wanting to keep it stateful, you should deploy the backend to a service that supports persistent connections and file storage (like Heroku with a persistent filesystem add-on, or Railway, Render, or Fly.io).

## 🛠️ Technology Stack

### Backend
- **Express** - Web server framework
- **TypeScript** - Type safety
- **express-session** - Session management
- **OpenAI SDK** - AI integration
- **Jest** - Testing framework
- **Supertest** - API testing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## 📚 Learning Resources

Since you mentioned you're new to web development, here are the key concepts used in this project:

### Backend Concepts
- **REST API**: The server exposes endpoints that the frontend calls
- **Sessions**: How we track users across requests (cookies)
- **File I/O**: Reading/writing chat history to disk
- **Async/Await**: Handling asynchronous operations (API calls, file operations)
- **Middleware**: Functions that process requests (CORS, JSON parsing, sessions)

### Frontend Concepts
- **Components**: Reusable UI pieces (GameCard, MessageBubble)
- **Hooks**: React functions for state and side effects (useState, useEffect)
- **Routing**: Navigation between pages without page reloads
- **Props**: Passing data from parent to child components
- **State**: Component data that can change over time

### Full-Stack Concepts
- **API Client**: Frontend code that calls backend endpoints
- **Type Safety**: Shared types ensure frontend and backend agree on data structure
- **CORS**: Allowing frontend (port 5173) to call backend (port 3001)
- **Sessions**: Maintaining user identity across requests

## 🐛 Troubleshooting

### "OPENAI_API_KEY environment variable is not set"
- Make sure you created `server/.env` file
- Check that the API key is valid and not expired

### "Failed to load games"
- Make sure `server/games.json` exists and is valid JSON
- Check the server console for detailed error messages

### Frontend can't connect to backend
- Make sure both servers are running
- Backend should be on port 3001
- Frontend should be on port 5173
- Check Vite proxy configuration in `client/vite.config.ts`

### Session not persisting
- Check that cookies are enabled in your browser
- Make sure you're not in incognito/private mode
- Check browser console for cookie errors

## 📄 License

MIT

## 🤝 Contributing

This is a learning project! Feel free to experiment and modify as needed.

---

**Built with ❤️ using Node.js, Express, React, and TypeScript**

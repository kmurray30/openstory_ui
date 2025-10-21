# OpenStory UI - Project Summary

## What Was Built

A complete full-stack TypeScript application for AI-powered interactive storytelling. Users can select from multiple story scenarios and have real-time conversations with AI that adapt to their choices.

## Architecture Overview

### Monorepo Structure

```
openstory_ui/
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared TypeScript types
└── user_data/       # File-based storage (gitignored)
```

### Technology Stack

**Backend:**
- Express.js with TypeScript
- express-session for user session management
- OpenAI SDK for GPT integration
- File-system based persistence
- Jest + Supertest for testing

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling and dev server
- Tailwind CSS for styling
- React Router for navigation
- Vitest + React Testing Library for testing

**Shared:**
- TypeScript interfaces shared between frontend and backend
- Ensures type safety across the entire stack

## Key Features Implemented

### 1. Game Selection System
- Dynamic game loading from JSON configuration
- Beautiful card-based UI with game thumbnails
- Easy to add new games by editing `server/games.json`

### 2. Real-Time Chat Interface
- Message history display
- Auto-scrolling to latest message
- Loading indicators during AI response
- Error handling with user-friendly messages

### 3. Session Management
- Cookie-based sessions (30-day expiration)
- Automatic session creation for new users
- No login required - sessions are anonymous

### 4. Chat History Persistence
- File-based storage per user per game
- Survives server restarts
- Structure: `user_data/{sessionId}/{gameId}/chat.json`

### 5. OpenAI Integration
- GPT-3.5-turbo by default (easily upgradable to GPT-4)
- Game-specific system prompts for context
- Full conversation history sent to maintain context

### 6. Comprehensive Testing
- Backend: API integration tests, utility function tests
- Frontend: Component tests, page tests, interaction tests
- All tests heavily commented for learning

## File Structure Explained

### Backend (`server/`)

```
server/
├── src/
│   ├── routes/
│   │   ├── games.ts          # GET /api/games endpoint
│   │   └── chat.ts           # GET/POST /api/chat/:gameId
│   ├── services/
│   │   └── openai.ts         # OpenAI API integration
│   ├── utils/
│   │   ├── fileStorage.ts    # Chat history persistence
│   │   └── gamesLoader.ts    # Load games.json
│   ├── __tests__/            # Backend tests
│   └── index.ts              # Express app entry point
├── games.json                # Game configurations
└── package.json
```

**Key Backend Concepts:**
- **Middleware**: Functions that process requests (CORS, sessions, JSON parsing)
- **Routes**: Handle specific API endpoints
- **Services**: Business logic (OpenAI calls)
- **Utils**: Helper functions (file I/O, game loading)

### Frontend (`client/`)

```
client/
├── src/
│   ├── components/
│   │   ├── GameCard.tsx       # Game selection card
│   │   ├── MessageBubble.tsx  # Individual message display
│   │   ├── LoadingSpinner.tsx # Reusable loading indicator
│   │   └── __tests__/         # Component tests
│   ├── pages/
│   │   ├── HomePage.tsx       # Game selection page
│   │   ├── ChatPage.tsx       # Chat interface
│   │   └── __tests__/         # Page tests
│   ├── services/
│   │   └── api.ts             # API client functions
│   ├── App.tsx                # Router setup
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles + Tailwind
├── index.html                 # HTML entry point
├── vite.config.ts             # Vite configuration
└── tailwind.config.js         # Tailwind configuration
```

**Key Frontend Concepts:**
- **Components**: Reusable UI pieces
- **Pages**: Top-level views for each route
- **Hooks**: React state management (useState, useEffect)
- **Props**: Data passed from parent to child components
- **Routing**: Navigation without page reloads

### Shared Types (`shared/`)

```
shared/
└── types.ts    # TypeScript interfaces used by both frontend and backend
```

**Key Types:**
- `Game`: Represents a story game
- `Message`: A single chat message
- `ChatHistory`: Complete conversation for a user + game
- Request/Response types for API endpoints

## Data Flow

### Game Selection Flow
1. User visits homepage
2. Frontend calls `GET /api/games`
3. Backend loads `games.json` and returns games
4. Frontend displays games as cards
5. User clicks a game
6. Frontend navigates to `/game/:gameId`

### Chat Flow
1. ChatPage loads
2. Frontend calls `GET /api/chat/:gameId` to load history
3. Backend checks session cookie, loads chat history from file
4. Frontend displays messages
5. User types and sends message
6. Frontend calls `POST /api/chat/:gameId` with message
7. Backend:
   - Saves user message to file
   - Calls OpenAI API with game system prompt + history + new message
   - Saves AI response to file
   - Returns both messages to frontend
8. Frontend displays both messages

### Session Flow
1. User visits site (no session cookie yet)
2. Backend creates new session, sets cookie
3. Cookie sent with all subsequent requests
4. Backend reads session ID from cookie
5. Uses session ID to load/save user-specific data

## API Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/games` | Get all games | None | `{ games: Game[] }` |
| GET | `/api/chat/:gameId` | Get chat history | None | `{ chatHistory: ChatHistory }` |
| POST | `/api/chat/:gameId` | Send message | `{ message: string }` | `{ userMessage, assistantMessage }` |
| GET | `/health` | Health check | None | `{ status: "ok", timestamp }` |

## Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key (from platform.openai.com)
- `SESSION_SECRET`: Random string for session encryption

### Optional
- `PORT`: Server port (default: 3001)
- `CLIENT_URL`: Frontend URL for CORS (default: localhost:5173)

## Testing Strategy

### Backend Tests
- **Unit tests**: Test individual functions (fileStorage, gamesLoader)
- **Integration tests**: Test API endpoints with mocked OpenAI
- **Mocking**: OpenAI calls mocked to avoid real API usage during tests

### Frontend Tests
- **Component tests**: Test individual components render correctly
- **Interaction tests**: Test user interactions (clicks, form submissions)
- **API mocking**: Mock API calls to test without backend

## Code Style

### Heavy Commenting
Every file includes:
- Module-level explanation at the top
- Function-level JSDoc comments explaining purpose, params, returns
- Inline comments for complex logic
- Designed for learning - explains WHY not just WHAT

### TypeScript Everywhere
- Strict mode enabled
- Shared types between frontend/backend
- No `any` types used
- Full type safety across the stack

## What's Missing (Future Enhancements)

This is a fully functional MVP, but here are potential additions:

### Production Improvements
- [ ] Database instead of file storage (PostgreSQL, MongoDB)
- [ ] User authentication system
- [ ] Rate limiting to prevent API abuse
- [ ] Error tracking (Sentry, Rollbar)
- [ ] Performance monitoring
- [ ] CDN for static assets

### Feature Additions
- [ ] Ability to reset a game (clear history)
- [ ] Multiple concurrent game sessions
- [ ] Game save/load with named saves
- [ ] Admin panel to manage games
- [ ] Streaming responses (show AI typing)
- [ ] Voice input/output
- [ ] Multiplayer games

### UX Improvements
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels)
- [ ] Mobile app wrapper
- [ ] Offline support with service workers

## Learning Resources

### New to Web Development?

**Start with these concepts:**
1. **HTTP basics**: Understand requests/responses, status codes
2. **JSON**: Data format for API communication
3. **Async/Await**: Handling asynchronous operations
4. **REST APIs**: Standard way to structure web APIs

**Key files to study:**
1. `server/src/index.ts` - See how Express server is set up
2. `client/src/pages/HomePage.tsx` - See how React components work
3. `shared/types.ts` - Understand TypeScript interfaces
4. `server/src/routes/chat.ts` - See API endpoint implementation
5. `client/src/services/api.ts` - See how frontend calls backend

**Suggested learning path:**
1. Run the app and play with it
2. Read through the comments in each file
3. Make small changes (add a button, change colors)
4. Try adding a new game in `games.json`
5. Look at the tests to understand what each function does
6. Try modifying a component and see what happens

## Questions & Support

### Common Questions

**Q: Can I use GPT-4 instead of GPT-3.5?**
A: Yes! In `server/src/services/openai.ts`, change `model: 'gpt-3.5-turbo'` to `model: 'gpt-4'`

**Q: How do I add more games?**
A: Edit `server/games.json` and add a new game object with id, name, description, systemPrompt, and thumbnailUrl.

**Q: Can users play multiple games at once?**
A: The current UI allows one game at a time, but the backend supports multiple concurrent games. You could modify the frontend to open multiple chat windows.

**Q: How long do sessions last?**
A: 30 days of inactivity. Configured in `server/src/index.ts` under session cookie maxAge.

**Q: Is this production-ready?**
A: It's a solid MVP! For production, consider adding: database storage, rate limiting, error tracking, and monitoring.

## Next Steps

1. **Get it running**: Follow [QUICKSTART.md](./QUICKSTART.md)
2. **Read the docs**: Check out [README.md](./README.md)
3. **Deploy it**: When ready, see [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Customize it**: Modify games, styles, AI parameters
5. **Learn from it**: Read the heavily commented code

---

**Built with care for learning and experimenting. Happy coding! 🚀**


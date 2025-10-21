/**
 * OpenStory Server Entry Point
 * 
 * This is the main file that starts the Express server.
 * It sets up middleware, routes, and error handling.
 */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import chatRouter from './routes/chat';
import gamesRouter from './routes/games';
import { validateApiKey } from './services/openai';
import { loadGames } from './utils/gamesLoader';

// Load environment variables from .env file
dotenv.config();

// Validate that required environment variables are set
validateApiKey();

// Create the Express application
const app = express();

// Get port from environment variable or use default
const PORT = process.env.PORT || 3001;

/**
 * MIDDLEWARE SETUP
 * 
 * Middleware are functions that process requests before they reach the routes.
 * They execute in the order they're defined here.
 */

// 1. CORS - Allows the frontend (running on a different port) to call this API
// In development, the frontend runs on port 5173 (Vite) and backend on 3001
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

// 2. Cookie Parser - Parses cookies from incoming requests
app.use(cookieParser());

// 3. JSON Parser - Parses JSON request bodies (req.body)
app.use(express.json());

// 4. Session Management - Creates and manages user sessions
// Sessions are identified by a cookie sent to the client
app.use(
  session({
    // Secret key used to sign the session ID cookie (should be random in production)
    secret: process.env.SESSION_SECRET || 'openstory-dev-secret-change-in-production',
    
    // Don't save session if it wasn't modified
    resave: false,
    
    // Don't create session until something is stored
    saveUninitialized: true,
    
    // Cookie configuration
    cookie: {
      // Session expires after 30 days of inactivity
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      
      // Security settings (set secure: true in production with HTTPS)
      httpOnly: true,  // Cookie can't be accessed by JavaScript (prevents XSS attacks)
      secure: false,   // Set to true in production (requires HTTPS)
      sameSite: 'lax', // CSRF protection
    },
  })
);

/**
 * ROUTES
 * 
 * Route handlers for different API endpoints
 */

// Health check endpoint - useful for deployment monitoring
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Games API routes - mounted at /api/games
app.use('/api/games', gamesRouter);

// Chat API routes - mounted at /api/chat
app.use('/api/chat', chatRouter);

// 404 handler - catches requests to undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    details: `Route ${req.method} ${req.path} does not exist`,
  });
});

/**
 * ERROR HANDLER
 * 
 * Catches any errors that occur during request processing
 * This is the last middleware and only runs when an error is passed to next(error)
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

/**
 * SERVER STARTUP
 * 
 * Load games configuration and start the server
 */
async function startServer() {
  try {
    // Pre-load games to validate the configuration
    const games = await loadGames();
    console.log(`Loaded ${games.length} games from configuration`);

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 OpenStory server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🎮 Games API: http://localhost:${PORT}/api/games`);
      console.log(`💬 Chat API: http://localhost:${PORT}/api/chat/:gameId`);
      console.log(`\n⚠️  Make sure OPENAI_API_KEY is set in your .env file`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit with error code
  }
}

// Start the server
startServer();

// Export the app for testing
export default app;


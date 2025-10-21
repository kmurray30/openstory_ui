/**
 * Shared TypeScript types used by both frontend and backend
 * 
 * These types ensure type safety across the entire application.
 * Both the client and server import from this file to maintain consistency.
 */

/**
 * Represents a single game/story that users can interact with
 */
export interface Game {
  id: string;                    // Unique identifier for the game
  name: string;                  // Display name shown to users
  description: string;           // Brief description of what the game is about
  systemPrompt: string;          // The system context sent to OpenAI for this game
  thumbnailUrl: string;          // URL/path to the game's thumbnail image
}

/**
 * Represents a single message in a chat conversation
 * Follows OpenAI's message format
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';  // Who sent the message
  content: string;                         // The actual text content
  timestamp: number;                       // Unix timestamp (ms) when message was created
}

/**
 * Represents the complete chat history for a user's game session
 */
export interface ChatHistory {
  messages: Message[];           // Array of all messages in chronological order
  gameId: string;                // Which game this chat belongs to
  sessionId: string;             // Which user session this chat belongs to
  createdAt: number;             // When this chat was first created (Unix timestamp)
  updatedAt: number;             // When this chat was last modified (Unix timestamp)
}

/**
 * API Request: Send a new message to a game
 */
export interface SendMessageRequest {
  message: string;               // The user's message content
}

/**
 * API Response: Response from sending a message
 */
export interface SendMessageResponse {
  userMessage: Message;          // The user's message that was sent
  assistantMessage: Message;     // The AI's response
}

/**
 * API Response: Get chat history
 */
export interface GetChatHistoryResponse {
  chatHistory: ChatHistory;
}

/**
 * API Response: Get all games
 */
export interface GetGamesResponse {
  games: Game[];
}

/**
 * Generic API error response
 */
export interface ApiError {
  error: string;                 // Error message
  details?: string;              // Optional additional details
}


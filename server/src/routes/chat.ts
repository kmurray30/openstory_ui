/**
 * Chat API Routes
 * 
 * Handles endpoints for chat functionality:
 * - Getting chat history for a game
 * - Sending new messages and receiving AI responses
 */

import { Request, Response, Router } from 'express';
import {
    ApiError,
    GetChatHistoryResponse,
    Message,
    SendMessageRequest,
    SendMessageResponse,
} from '../../../shared/types';
import { getChatCompletion } from '../services/openai';
import { appendMessage, loadChatHistory } from '../utils/fileStorage';
import { getGameById } from '../utils/gamesLoader';

const router = Router();

/**
 * GET /api/chat/:gameId
 * 
 * Retrieves the chat history for a specific game and the current user's session.
 * If no history exists, returns an empty chat history.
 */
router.get('/:gameId', async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    
    // Get the session ID from the request
    // This is set by the session middleware in the main app
    const sessionId = req.sessionID;

    // Verify that the game exists
    const game = await getGameById(gameId);
    if (!game) {
      const errorResponse: ApiError = {
        error: 'Game not found',
        details: `No game exists with ID: ${gameId}`,
      };
      return res.status(404).json(errorResponse);
    }

    // Load the chat history from the file system
    const chatHistory = await loadChatHistory(sessionId, gameId);

    // Return the chat history
    const response: GetChatHistoryResponse = { chatHistory };
    res.json(response);
  } catch (error) {
    console.error('Error loading chat history:', error);
    const errorResponse: ApiError = {
      error: 'Failed to load chat history',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * POST /api/chat/:gameId
 * 
 * Sends a new message to a game and gets an AI response.
 * 
 * Request body should contain:
 * - message: string (the user's message)
 * 
 * This endpoint:
 * 1. Validates the game exists
 * 2. Loads the chat history
 * 3. Creates a user message object
 * 4. Calls OpenAI with the game's system prompt and history
 * 5. Saves both the user message and AI response
 * 6. Returns both messages to the client
 */
router.post('/:gameId', async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { message } = req.body as SendMessageRequest;

    // Validate that a message was provided
    if (!message || typeof message !== 'string' || message.trim() === '') {
      const errorResponse: ApiError = {
        error: 'Invalid request',
        details: 'Message is required and must be a non-empty string',
      };
      return res.status(400).json(errorResponse);
    }

    // Get the session ID
    const sessionId = req.sessionID;

    // Verify that the game exists and get its configuration
    const game = await getGameById(gameId);
    if (!game) {
      const errorResponse: ApiError = {
        error: 'Game not found',
        details: `No game exists with ID: ${gameId}`,
      };
      return res.status(404).json(errorResponse);
    }

    // Load the existing chat history
    const chatHistory = await loadChatHistory(sessionId, gameId);

    // Create the user message object
    const userMessage: Message = {
      role: 'user',
      content: message.trim(),
      timestamp: Date.now(),
    };

    // Save the user message to the history
    await appendMessage(sessionId, gameId, userMessage);

    // Call OpenAI to get the assistant's response
    // Pass the game's system prompt, chat history, and new user message
    const assistantMessage = await getChatCompletion(
      game.systemPrompt,
      chatHistory.messages,
      userMessage.content
    );

    // Save the assistant's response to the history
    await appendMessage(sessionId, gameId, assistantMessage);

    // Return both messages to the client
    const response: SendMessageResponse = {
      userMessage,
      assistantMessage,
    };
    res.json(response);
  } catch (error) {
    console.error('Error processing chat message:', error);
    const errorResponse: ApiError = {
      error: 'Failed to process message',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(errorResponse);
  }
});

export default router;


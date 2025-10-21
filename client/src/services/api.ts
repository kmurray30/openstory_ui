/**
 * API Client Service
 * 
 * This module handles all communication between the frontend and backend API.
 * It provides typed functions for fetching games, chat history, and sending messages.
 */

import {
    ApiError,
    Game,
    GetChatHistoryResponse,
    GetGamesResponse,
    SendMessageRequest,
    SendMessageResponse,
} from '../../../shared/types';

// Base URL for API requests
// In development, Vite proxy forwards /api/* to the backend server
const API_BASE_URL = '/api';

/**
 * Custom error class for API errors
 * Includes both the error message and optional details
 */
export class ApiClientError extends Error {
  details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.details = details;
  }
}

/**
 * Helper function to handle API responses
 * Throws an error if the response is not ok
 * 
 * @param response - The fetch Response object
 * @returns The parsed JSON data
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to parse error message from response body
    try {
      const errorData: ApiError = await response.json();
      throw new ApiClientError(errorData.error, errorData.details);
    } catch (error) {
      // If parsing fails, throw generic error
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new ApiClientError(
        `HTTP ${response.status}: ${response.statusText}`
      );
    }
  }

  return response.json();
}

/**
 * Fetches all available games
 * 
 * @returns Array of all games
 * @throws ApiClientError if the request fails
 */
export async function fetchGames(): Promise<Game[]> {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: 'GET',
    credentials: 'include', // Include cookies for session management
  });

  const data = await handleResponse<GetGamesResponse>(response);
  return data.games;
}

/**
 * Fetches the chat history for a specific game
 * Returns empty history if no previous chat exists
 * 
 * @param gameId - The ID of the game
 * @returns The chat history for this game and session
 * @throws ApiClientError if the request fails
 */
export async function fetchChatHistory(gameId: string) {
  const response = await fetch(`${API_BASE_URL}/chat/${gameId}`, {
    method: 'GET',
    credentials: 'include', // Include cookies for session management
  });

  const data = await handleResponse<GetChatHistoryResponse>(response);
  return data.chatHistory;
}

/**
 * Sends a message to a game and gets the AI's response
 * 
 * @param gameId - The ID of the game
 * @param message - The user's message text
 * @returns Object containing both the user message and assistant response
 * @throws ApiClientError if the request fails
 */
export async function sendMessage(
  gameId: string,
  message: string
): Promise<SendMessageResponse> {
  const requestBody: SendMessageRequest = { message };

  const response = await fetch(`${API_BASE_URL}/chat/${gameId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session management
    body: JSON.stringify(requestBody),
  });

  return handleResponse<SendMessageResponse>(response);
}


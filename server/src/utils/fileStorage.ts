/**
 * File Storage Utilities
 * 
 * This module handles all file system operations for persisting chat history.
 * Each user session gets their own folder, and within that, each game gets its own chat.json file.
 * 
 * Structure: /user_data/{sessionId}/{gameId}/chat.json
 */

import fs from 'fs/promises';
import path from 'path';
import { ChatHistory, Message } from '../../../shared/types';

// Base directory for all user data (relative to server root)
const USER_DATA_DIR = path.join(__dirname, '..', '..', '..', 'user_data');

/**
 * Ensures that a directory exists, creating it (and parent directories) if needed
 * 
 * @param dirPath - The directory path to ensure exists
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
    // Directory exists, do nothing
  } catch (error) {
    // Directory doesn't exist, create it (recursive creates parent dirs too)
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Gets the file path for a specific session and game's chat history
 * 
 * @param sessionId - The user's session ID
 * @param gameId - The game ID
 * @returns The full path to the chat.json file
 */
function getChatFilePath(sessionId: string, gameId: string): string {
  return path.join(USER_DATA_DIR, sessionId, gameId, 'chat.json');
}

/**
 * Loads chat history for a specific session and game
 * If no history exists, returns a new empty chat history object
 * 
 * @param sessionId - The user's session ID
 * @param gameId - The game ID
 * @returns The chat history (existing or new)
 */
export async function loadChatHistory(
  sessionId: string,
  gameId: string
): Promise<ChatHistory> {
  const filePath = getChatFilePath(sessionId, gameId);

  try {
    // Try to read the existing file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const chatHistory: ChatHistory = JSON.parse(fileContent);
    return chatHistory;
  } catch (error) {
    // File doesn't exist or is invalid - return new chat history
    const now = Date.now();
    return {
      messages: [],
      gameId,
      sessionId,
      createdAt: now,
      updatedAt: now,
    };
  }
}

/**
 * Saves chat history for a specific session and game
 * Creates necessary directories if they don't exist
 * 
 * @param sessionId - The user's session ID
 * @param gameId - The game ID
 * @param chatHistory - The chat history to save
 */
export async function saveChatHistory(
  sessionId: string,
  gameId: string,
  chatHistory: ChatHistory
): Promise<void> {
  const filePath = getChatFilePath(sessionId, gameId);
  const dirPath = path.dirname(filePath);

  // Ensure the directory structure exists
  await ensureDirectoryExists(dirPath);

  // Update the timestamp
  chatHistory.updatedAt = Date.now();

  // Write the file (pretty-printed for easier debugging)
  await fs.writeFile(filePath, JSON.stringify(chatHistory, null, 2), 'utf-8');
}

/**
 * Adds a new message to a chat history and saves it
 * Convenience function that loads, appends, and saves in one call
 * 
 * @param sessionId - The user's session ID
 * @param gameId - The game ID
 * @param message - The message to add
 */
export async function appendMessage(
  sessionId: string,
  gameId: string,
  message: Message
): Promise<ChatHistory> {
  // Load existing history (or create new one)
  const chatHistory = await loadChatHistory(sessionId, gameId);

  // Add the new message
  chatHistory.messages.push(message);

  // Save back to disk
  await saveChatHistory(sessionId, gameId, chatHistory);

  return chatHistory;
}

/**
 * Deletes all chat history for a specific session and game
 * Useful for "reset" functionality
 * 
 * @param sessionId - The user's session ID
 * @param gameId - The game ID
 */
export async function deleteChatHistory(
  sessionId: string,
  gameId: string
): Promise<void> {
  const filePath = getChatFilePath(sessionId, gameId);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    // File doesn't exist, that's fine - already deleted
  }
}


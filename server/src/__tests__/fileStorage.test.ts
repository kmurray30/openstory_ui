/**
 * Tests for File Storage Utilities
 * 
 * These tests verify that chat histories are correctly saved and loaded from disk.
 */

import fs from 'fs/promises';
import path from 'path';
import { ChatHistory, Message } from '../../../shared/types';
import {
    appendMessage,
    deleteChatHistory,
    loadChatHistory,
    saveChatHistory,
} from '../utils/fileStorage';

// Test data directory (will be cleaned up after tests)
const TEST_DATA_DIR = path.join(__dirname, '..', '..', '..', 'user_data');

describe('File Storage Utilities', () => {
  const testSessionId = 'test-session-123';
  const testGameId = 'test-game';

  // Clean up test data before and after tests
  beforeAll(async () => {
    // Ensure test directory exists
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test data after each test
    try {
      await deleteChatHistory(testSessionId, testGameId);
    } catch (error) {
      // Ignore errors (file might not exist)
    }
  });

  describe('loadChatHistory', () => {
    it('should return empty chat history when file does not exist', async () => {
      const history = await loadChatHistory(testSessionId, testGameId);

      expect(history.sessionId).toBe(testSessionId);
      expect(history.gameId).toBe(testGameId);
      expect(history.messages).toEqual([]);
      expect(history.createdAt).toBeDefined();
      expect(history.updatedAt).toBeDefined();
    });

    it('should load existing chat history', async () => {
      // First, create a history
      const testHistory: ChatHistory = {
        sessionId: testSessionId,
        gameId: testGameId,
        messages: [
          { role: 'user', content: 'Hello', timestamp: Date.now() },
          { role: 'assistant', content: 'Hi there!', timestamp: Date.now() },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveChatHistory(testSessionId, testGameId, testHistory);

      // Now load it
      const loaded = await loadChatHistory(testSessionId, testGameId);

      expect(loaded.messages).toHaveLength(2);
      expect(loaded.messages[0].content).toBe('Hello');
      expect(loaded.messages[1].content).toBe('Hi there!');
    });
  });

  describe('saveChatHistory', () => {
    it('should save chat history to disk', async () => {
      const testHistory: ChatHistory = {
        sessionId: testSessionId,
        gameId: testGameId,
        messages: [{ role: 'user', content: 'Test message', timestamp: Date.now() }],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveChatHistory(testSessionId, testGameId, testHistory);

      // Verify the file was created
      const loaded = await loadChatHistory(testSessionId, testGameId);
      expect(loaded.messages).toHaveLength(1);
      expect(loaded.messages[0].content).toBe('Test message');
    });

    it('should update updatedAt timestamp when saving', async () => {
      const testHistory: ChatHistory = {
        sessionId: testSessionId,
        gameId: testGameId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now() - 10000, // 10 seconds ago
      };

      const oldTimestamp = testHistory.updatedAt;

      // Wait a bit and save
      await new Promise((resolve) => setTimeout(resolve, 10));
      await saveChatHistory(testSessionId, testGameId, testHistory);

      // Load and check the timestamp was updated
      const loaded = await loadChatHistory(testSessionId, testGameId);
      expect(loaded.updatedAt).toBeGreaterThan(oldTimestamp);
    });
  });

  describe('appendMessage', () => {
    it('should add message to empty history', async () => {
      const testMessage: Message = {
        role: 'user',
        content: 'First message',
        timestamp: Date.now(),
      };

      const history = await appendMessage(testSessionId, testGameId, testMessage);

      expect(history.messages).toHaveLength(1);
      expect(history.messages[0].content).toBe('First message');
    });

    it('should append message to existing history', async () => {
      // Create initial history
      const message1: Message = {
        role: 'user',
        content: 'Message 1',
        timestamp: Date.now(),
      };
      await appendMessage(testSessionId, testGameId, message1);

      // Append second message
      const message2: Message = {
        role: 'assistant',
        content: 'Message 2',
        timestamp: Date.now(),
      };
      const history = await appendMessage(testSessionId, testGameId, message2);

      expect(history.messages).toHaveLength(2);
      expect(history.messages[0].content).toBe('Message 1');
      expect(history.messages[1].content).toBe('Message 2');
    });
  });

  describe('deleteChatHistory', () => {
    it('should delete existing chat history', async () => {
      // Create a history
      const testMessage: Message = {
        role: 'user',
        content: 'Test',
        timestamp: Date.now(),
      };
      await appendMessage(testSessionId, testGameId, testMessage);

      // Delete it
      await deleteChatHistory(testSessionId, testGameId);

      // Load should return empty history
      const history = await loadChatHistory(testSessionId, testGameId);
      expect(history.messages).toHaveLength(0);
    });

    it('should not throw error when deleting non-existent history', async () => {
      // Should not throw
      await expect(
        deleteChatHistory('non-existent-session', 'non-existent-game')
      ).resolves.not.toThrow();
    });
  });
});


/**
 * API Integration Tests
 * 
 * These tests verify that the API endpoints work correctly.
 * We use Supertest to make HTTP requests to the Express app.
 * We mock the OpenAI service to avoid making real API calls during tests.
 */

import request from 'supertest';
import { Message } from '../../../shared/types';
import app from '../index';
import * as openaiService from '../services/openai';

// Mock the OpenAI service to avoid real API calls
jest.mock('../services/openai', () => ({
  getChatCompletion: jest.fn(),
  validateApiKey: jest.fn(), // Mock this so server starts without real API key
}));

describe('API Endpoints', () => {
  // Mock OpenAI response
  const mockAssistantMessage: Message = {
    role: 'assistant',
    content: 'This is a test response from the AI',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up default mock implementation
    (openaiService.getChatCompletion as jest.Mock).mockResolvedValue(
      mockAssistantMessage
    );
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/games', () => {
    it('should return list of games', async () => {
      const response = await request(app).get('/api/games');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('games');
      expect(Array.isArray(response.body.games)).toBe(true);
      expect(response.body.games.length).toBeGreaterThan(0);

      // Check first game has required fields
      const firstGame = response.body.games[0];
      expect(firstGame).toHaveProperty('id');
      expect(firstGame).toHaveProperty('name');
      expect(firstGame).toHaveProperty('description');
      expect(firstGame).toHaveProperty('systemPrompt');
      expect(firstGame).toHaveProperty('thumbnailUrl');
    });
  });

  describe('GET /api/chat/:gameId', () => {
    it('should return empty chat history for new session', async () => {
      const response = await request(app).get('/api/chat/fantasy-quest');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('chatHistory');
      expect(response.body.chatHistory.messages).toEqual([]);
      expect(response.body.chatHistory.gameId).toBe('fantasy-quest');
    });

    it('should return 404 for non-existent game', async () => {
      const response = await request(app).get('/api/chat/non-existent-game');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/chat/:gameId', () => {
    it('should send message and get AI response', async () => {
      const response = await request(app)
        .post('/api/chat/fantasy-quest')
        .send({ message: 'Hello, game!' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userMessage');
      expect(response.body).toHaveProperty('assistantMessage');

      // Check user message
      expect(response.body.userMessage.role).toBe('user');
      expect(response.body.userMessage.content).toBe('Hello, game!');

      // Check assistant message
      expect(response.body.assistantMessage.role).toBe('assistant');
      expect(response.body.assistantMessage.content).toBe(mockAssistantMessage.content);

      // Verify OpenAI was called
      expect(openaiService.getChatCompletion).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for missing message', async () => {
      const response = await request(app)
        .post('/api/chat/fantasy-quest')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for empty message', async () => {
      const response = await request(app)
        .post('/api/chat/fantasy-quest')
        .send({ message: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent game', async () => {
      const response = await request(app)
        .post('/api/chat/non-existent-game')
        .send({ message: 'Hello' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should persist messages across requests', async () => {
      const agent = request.agent(app); // Use agent to maintain session

      // Send first message
      await agent
        .post('/api/chat/fantasy-quest')
        .send({ message: 'First message' });

      // Get chat history
      const response = await agent.get('/api/chat/fantasy-quest');

      expect(response.status).toBe(200);
      expect(response.body.chatHistory.messages.length).toBeGreaterThan(0);

      // Should have both user message and assistant response
      const messages = response.body.chatHistory.messages;
      expect(messages[0].content).toBe('First message');
    });

    it('should handle OpenAI errors gracefully', async () => {
      // Mock OpenAI to throw an error
      (openaiService.getChatCompletion as jest.Mock).mockRejectedValue(
        new Error('OpenAI API error')
      );

      const response = await request(app)
        .post('/api/chat/fantasy-quest')
        .send({ message: 'Test message' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/api/undefined-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});


/**
 * Jest Setup File
 * 
 * This runs before all tests.
 * We use it to set up environment variables for testing.
 */

// Set test environment variables
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.NODE_ENV = 'test';


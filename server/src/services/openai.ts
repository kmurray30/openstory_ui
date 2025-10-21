/**
 * OpenAI Service
 * 
 * This module handles all interactions with the OpenAI API.
 * It formats messages, makes API calls, and handles errors.
 */

import OpenAI from 'openai';
import { Message } from '../../../shared/types';

// Initialize the OpenAI client
// The API key is read from the OPENAI_API_KEY environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Sends a chat completion request to OpenAI
 * 
 * This function takes a system prompt (defines the game's context),
 * the chat history (previous messages), and a new user message.
 * It sends all of this to OpenAI and returns the assistant's response.
 * 
 * @param systemPrompt - The system prompt that sets the context/personality
 * @param chatHistory - Array of previous messages in the conversation
 * @param userMessage - The new message from the user
 * @returns The assistant's response message
 * @throws Error if the API call fails
 */
export async function getChatCompletion(
  systemPrompt: string,
  chatHistory: Message[],
  userMessage: string
): Promise<Message> {
  try {
    // Build the messages array for OpenAI
    // Format: [system message, ...chat history, new user message]
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      // First, set the system prompt (defines behavior/context)
      {
        role: 'system',
        content: systemPrompt,
      },
      // Then add the existing chat history (but exclude system messages from history)
      ...chatHistory
        .filter((msg) => msg.role !== 'system')
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      // Finally, add the new user message
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Make the API call to OpenAI
    // Using gpt-3.5-turbo for speed and cost-effectiveness
    // You can change this to gpt-4 for better quality responses
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // The AI model to use
      messages: messages,     // The conversation
      temperature: 0.8,       // Controls randomness (0-2, higher = more creative)
      max_tokens: 500,        // Maximum length of the response
    });

    // Extract the assistant's message from the response
    const assistantContent = completion.choices[0]?.message?.content;

    if (!assistantContent) {
      throw new Error('No response content from OpenAI');
    }

    // Return as a properly formatted Message object
    return {
      role: 'assistant',
      content: assistantContent,
      timestamp: Date.now(),
    };
  } catch (error) {
    // Handle different types of errors
    if (error instanceof OpenAI.APIError) {
      // OpenAI-specific errors (rate limits, invalid API key, etc.)
      console.error('OpenAI API Error:', error.status, error.message);
      throw new Error(`OpenAI API Error: ${error.message}`);
    } else if (error instanceof Error) {
      // Other errors
      console.error('Error calling OpenAI:', error.message);
      throw error;
    } else {
      // Unknown error type
      throw new Error('Unknown error calling OpenAI');
    }
  }
}

/**
 * Validates that the OpenAI API key is configured
 * Should be called at server startup
 * 
 * @throws Error if API key is not set
 */
export function validateApiKey(): void {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY environment variable is not set. ' +
        'Please create a .env file with your OpenAI API key.'
    );
  }
}


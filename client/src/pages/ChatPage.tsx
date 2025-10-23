/**
 * Chat Page Component
 * 
 * The chat interface where users interact with a specific game.
 * Shows message history and allows sending new messages.
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Message } from '../../../shared/types';
import adventureThumb from '../../assets/adventure_game_thumbnail.png';
import background from '../../assets/background.png';
import detectiveThumb from '../../assets/detective_game_thumbnail.png';
import logo from '../../assets/openstory_vector.png';
import spaceThumb from '../../assets/space_game_thumbnail.png';
import LoadingSpinner from '../components/LoadingSpinner';
import MessageBubble from '../components/MessageBubble';
import {
  ApiClientError,
  fetchChatHistory,
  fetchGames,
  sendMessage,
} from '../services/api';

export default function ChatPage() {
  // Get gameId from URL parameters (e.g., /game/fantasy-quest)
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  // Ref to the messages container for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State management
  const [messages, setMessages] = useState<Message[]>([]);          // Chat messages
  const [gameName, setGameName] = useState<string>('');             // Name of current game
  const [gameBackground, setGameBackground] = useState<string>(background); // Background image for this game
  const [inputValue, setInputValue] = useState('');                 // Text input value
  const [loading, setLoading] = useState(true);                     // Initial loading
  const [sending, setSending] = useState(false);                    // Sending message
  const [error, setError] = useState<string | null>(null);          // Error message

  // Thumbnail mapping for game backgrounds
  const thumbnailMap: Record<string, string> = {
    'fantasy-quest': adventureThumb,
    'detective-noir': detectiveThumb,
    'space-explorer': spaceThumb,
  };

  // Load game info and chat history when component mounts
  useEffect(() => {
    if (gameId) {
      loadChatData(gameId);
    }
  }, [gameId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Scrolls the message list to the bottom (shows latest message)
   */
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Loads the game info and chat history
   */
  async function loadChatData(gameId: string) {
    try {
      setLoading(true);
      setError(null);

      // Load game info to get the game name
      const games = await fetchGames();
      const game = games.find((g) => g.id === gameId);

      if (!game) {
        setError('Game not found');
        return;
      }

      setGameName(game.name);
      
      // Set the background image for this game
      setGameBackground(thumbnailMap[gameId] || background);

      // Load chat history for this game
      const chatHistory = await fetchChatHistory(gameId);
      setMessages(chatHistory.messages);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load chat. Please try again.');
      }
      console.error('Error loading chat:', err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles sending a new message
   */
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();

    // Validate input
    if (!inputValue.trim() || !gameId) {
      return;
    }

    const messageText = inputValue.trim();
    setInputValue(''); // Clear input immediately for better UX

    try {
      setSending(true);
      setError(null);

      // Send message to API
      const response = await sendMessage(gameId, messageText);

      // Add both user message and assistant response to the chat
      setMessages((prev) => [
        ...prev,
        response.userMessage,
        response.assistantMessage,
      ]);
    } catch (err) {
      // If error, restore the input value
      setInputValue(messageText);

      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to send message. Please try again.');
      }
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  }

  /**
   * Handles back button click
   */
  function handleBackClick() {
    navigate('/');
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${gameBackground})`,
            filter: 'grayscale(50%)'
          }}
        />
        <div 
          className="fixed inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(51, 65, 85, 0.3) 0%, rgba(51, 65, 85, 0.85) 100%)'
          }}
        />
        <div className="relative z-10">
          <LoadingSpinner size="large" text="Loading chat..." />
        </div>
      </div>
    );
  }

  // Error state
  if (error && messages.length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${gameBackground})`,
            filter: 'grayscale(50%)'
          }}
        />
        <div 
          className="fixed inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(51, 65, 85, 0.3) 0%, rgba(51, 65, 85, 0.85) 100%)'
          }}
        />
        <div className="relative z-10 max-w-md w-full">
        <div className="max-w-md bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8 text-center">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-200 font-medium mb-4">{error}</p>
          <button onClick={handleBackClick} className="btn-primary">
            Back to Home
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative">
      {/* Background image - game specific (50% desaturated) */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${gameBackground})`,
          filter: 'grayscale(50%)'
        }}
      />
      
      {/* Translucent frame overlay - more opaque at edges, clear in center */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(51, 65, 85, 0.3) 0%, rgba(51, 65, 85, 0.85) 100%)'
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header - Custom Navy */}
        <header className="bg-header border-b-2 border-slate-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Back button and logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
              aria-label="Back to home"
            >
              <svg
                className="w-6 h-6 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <img 
                src={logo} 
                alt="OpenStory" 
                className="h-16"
              />
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse shadow-lg shadow-accent-500/50" />
            <span className="text-sm text-slate-300">Online</span>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto scrollbar-thin container mx-auto px-4 py-6">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg
              className="w-20 h-20 text-slate-700 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-300 text-lg mb-2">Start your adventure</p>
            <p className="text-slate-500 text-sm">
              Send a message to begin your story
            </p>
          </div>
        )}

        {/* Message list */}
        {messages.length > 0 && (
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}

            {/* Loading indicator while AI is responding */}
            {sending && (
              <div className="flex justify-start mb-4">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Error banner (if error occurs during chat) */}
      {error && messages.length > 0 && (
        <div className="bg-red-950/50 border-t border-red-800 px-4 py-3">
          <div className="container mx-auto max-w-4xl">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Input area */}
      <footer className="bg-header border-t-2 border-slate-800 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              {/* Text input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1"
                disabled={sending}
                autoFocus
              />

              {/* Send button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || sending}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </footer>
      </div>
    </div>
  );
}


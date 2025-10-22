/**
 * Message Bubble Component
 * 
 * Displays a single message in the chat interface.
 * Styles differently based on whether it's from the user or assistant.
 */

import { Message } from '../../../shared/types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  // Different styles for user vs assistant messages
  const isUser = message.role === 'user';

  // Format the timestamp to a readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-3 shadow-lg
          ${
            isUser
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-sm shadow-primary-900/50'  // User messages: purple gradient
              : 'bg-dark-200 text-gray-100 rounded-bl-sm border border-dark-300'      // Assistant messages: dark
          }
        `}
      >
        {/* Message content */}
        <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>

        {/* Timestamp */}
        <p
          className={`
            text-xs mt-1
            ${isUser ? 'text-primary-200' : 'text-gray-500'}
          `}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}


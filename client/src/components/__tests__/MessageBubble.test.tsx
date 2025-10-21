/**
 * Tests for MessageBubble Component
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Message } from '../../../../shared/types';
import MessageBubble from '../MessageBubble';

describe('MessageBubble', () => {
  it('renders user message with correct styling', () => {
    const userMessage: Message = {
      role: 'user',
      content: 'Hello, this is a test message',
      timestamp: Date.now(),
    };

    const { container } = render(<MessageBubble message={userMessage} />);

    // Check message content is displayed
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();

    // Check that user messages have primary background
    const bubble = container.querySelector('.bg-primary-600');
    expect(bubble).toBeInTheDocument();
  });

  it('renders assistant message with correct styling', () => {
    const assistantMessage: Message = {
      role: 'assistant',
      content: 'This is an AI response',
      timestamp: Date.now(),
    };

    const { container } = render(<MessageBubble message={assistantMessage} />);

    // Check message content is displayed
    expect(screen.getByText('This is an AI response')).toBeInTheDocument();

    // Check that assistant messages have white background
    const bubble = container.querySelector('.bg-white');
    expect(bubble).toBeInTheDocument();
  });

  it('displays timestamp in readable format', () => {
    const message: Message = {
      role: 'user',
      content: 'Test message',
      timestamp: new Date('2024-01-01T12:30:00').getTime(),
    };

    render(<MessageBubble message={message} />);

    // Check that a time is displayed (format may vary by locale)
    // Just check that something time-like is present
    const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });

  it('handles multiline content correctly', () => {
    const message: Message = {
      role: 'user',
      content: 'Line 1\nLine 2\nLine 3',
      timestamp: Date.now(),
    };

    render(<MessageBubble message={message} />);

    // Check that content is displayed
    expect(screen.getByText('Line 1\nLine 2\nLine 3')).toBeInTheDocument();
  });
});


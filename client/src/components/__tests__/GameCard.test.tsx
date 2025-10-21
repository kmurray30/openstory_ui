/**
 * Tests for GameCard Component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Game } from '../../../../shared/types';
import GameCard from '../GameCard';

describe('GameCard', () => {
  const mockGame: Game = {
    id: 'test-game',
    name: 'Test Game',
    description: 'This is a test game description',
    systemPrompt: 'Test prompt',
    thumbnailUrl: 'https://example.com/image.jpg',
  };

  it('renders game information correctly', () => {
    const onClick = vi.fn();
    render(<GameCard game={mockGame} onClick={onClick} />);

    // Check that game name and description are displayed
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('This is a test game description')).toBeInTheDocument();

    // Check that image is rendered with correct alt text
    const image = screen.getByAltText('Test Game');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockGame.thumbnailUrl);
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<GameCard game={mockGame} onClick={onClick} />);

    // Click the card
    const card = screen.getByRole('button');
    await user.click(card);

    // Verify onClick was called
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<GameCard game={mockGame} onClick={onClick} />);

    // Focus the card and press Enter
    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    // Verify onClick was called
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});


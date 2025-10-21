/**
 * Tests for HomePage Component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Game } from '../../../../shared/types';
import * as api from '../../services/api';
import HomePage from '../HomePage';

// Mock the API module
vi.mock('../../services/api');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage', () => {
  const mockGames: Game[] = [
    {
      id: 'game-1',
      name: 'Game One',
      description: 'First test game',
      systemPrompt: 'Prompt 1',
      thumbnailUrl: 'https://example.com/1.jpg',
    },
    {
      id: 'game-2',
      name: 'Game Two',
      description: 'Second test game',
      systemPrompt: 'Prompt 2',
      thumbnailUrl: 'https://example.com/2.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading spinner initially', () => {
    // Mock API to never resolve
    vi.mocked(api.fetchGames).mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading games...')).toBeInTheDocument();
  });

  it('displays games after loading', async () => {
    // Mock successful API response
    vi.mocked(api.fetchGames).mockResolvedValue(mockGames);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for games to load
    await waitFor(() => {
      expect(screen.getByText('Game One')).toBeInTheDocument();
      expect(screen.getByText('Game Two')).toBeInTheDocument();
    });

    // Check descriptions are displayed
    expect(screen.getByText('First test game')).toBeInTheDocument();
    expect(screen.getByText('Second test game')).toBeInTheDocument();
  });

  it('navigates to chat page when game is clicked', async () => {
    vi.mocked(api.fetchGames).mockResolvedValue(mockGames);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for games to load
    await waitFor(() => {
      expect(screen.getByText('Game One')).toBeInTheDocument();
    });

    // Click on a game
    const gameCard = screen.getByText('Game One').closest('[role="button"]');
    if (gameCard) {
      await user.click(gameCard);
    }

    // Verify navigation was called
    expect(mockNavigate).toHaveBeenCalledWith('/game/game-1');
  });

  it('displays error message when API fails', async () => {
    // Mock API error
    vi.mocked(api.fetchGames).mockRejectedValue(
      new api.ApiClientError('Failed to load')
    );

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for error to display
    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    // Check that retry button is shown
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('can retry loading after error', async () => {
    const user = userEvent.setup();

    // First call fails, second succeeds
    vi.mocked(api.fetchGames)
      .mockRejectedValueOnce(new api.ApiClientError('Failed'))
      .mockResolvedValueOnce(mockGames);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);

    // Wait for games to load
    await waitFor(() => {
      expect(screen.getByText('Game One')).toBeInTheDocument();
    });
  });

  it('displays empty state when no games available', async () => {
    // Mock empty games array
    vi.mocked(api.fetchGames).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText(/No games available yet/i)).toBeInTheDocument();
    });
  });
});


/**
 * Home Page Component
 * 
 * The main landing page showing all available games.
 * Users click on a game card to start playing.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../../../shared/types';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ApiClientError, fetchGames } from '../services/api';

export default function HomePage() {
  // Navigation hook for routing to chat page
  const navigate = useNavigate();

  // State management
  const [games, setGames] = useState<Game[]>([]);          // List of available games
  const [loading, setLoading] = useState(true);             // Loading state
  const [error, setError] = useState<string | null>(null); // Error message

  // Load games when component mounts
  useEffect(() => {
    loadGames();
  }, []);

  /**
   * Fetches games from the API
   */
  async function loadGames() {
    try {
      setLoading(true);
      setError(null);

      // Call API to get games
      const gamesData = await fetchGames();
      setGames(gamesData);
    } catch (err) {
      // Handle errors
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load games. Please try again.');
      }
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles clicking on a game card
   * Navigates to the chat page for that game
   */
  function handleGameClick(gameId: string) {
    navigate(`/game/${gameId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-primary-600">
            OpenStory
          </h1>
          <p className="text-gray-600 mt-2">
            Choose your adventure and start your interactive story
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" text="Loading games..." />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-3"
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
            <p className="text-red-800 font-medium mb-3">{error}</p>
            <button onClick={loadGames} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Games grid */}
        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => handleGameClick(game.id)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && games.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No games available yet. Check back soon!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>OpenStory - AI-Powered Interactive Stories</p>
      </footer>
    </div>
  );
}


/**
 * Game Card Component
 * 
 * Displays a game as a clickable card with image, title, and description.
 * Used on the home page to show available games.
 */

import { Game } from '../../../shared/types';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Allow keyboard navigation (Enter or Space to activate)
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Game thumbnail image */}
      <div className="h-48 overflow-hidden bg-gray-200">
        <img
          src={game.thumbnailUrl}
          alt={game.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Game info */}
      <div className="p-5">
        {/* Game title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {game.name}
        </h3>

        {/* Game description */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {game.description}
        </p>

        {/* Call to action */}
        <div className="mt-4 flex items-center text-primary-600 font-medium">
          <span>Start Adventure</span>
          <svg
            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}


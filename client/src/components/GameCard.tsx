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
      className="card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-900/50 group"
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
      {/* Game thumbnail image with overlay */}
      <div className="h-48 overflow-hidden bg-slate-700 relative">
        <img
          src={game.thumbnailUrl}
          alt={game.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent" />
      </div>

      {/* Game info */}
      <div className="p-5">
        {/* Game title */}
        <h3 className="text-xl font-bold text-gray-50 mb-2 group-hover:text-primary-400 transition-colors">
          {game.name}
        </h3>

        {/* Game description */}
        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
          {game.description}
        </p>

        {/* Call to action */}
        <div className="mt-4 flex items-center text-primary-400 font-medium group-hover:text-accent-400 transition-colors">
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


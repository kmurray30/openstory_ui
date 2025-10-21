/**
 * Games API Routes
 * 
 * Handles endpoints related to fetching available games
 */

import { Request, Response, Router } from 'express';
import { ApiError, GetGamesResponse } from '../../../shared/types';
import { loadGames } from '../utils/gamesLoader';

const router = Router();

/**
 * GET /api/games
 * 
 * Returns all available games that users can play.
 * This is called when the home page loads to display the game tiles.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Load all games from games.json
    const games = await loadGames();

    // Return the games in the response
    const response: GetGamesResponse = { games };
    res.json(response);
  } catch (error) {
    // If there's an error loading games, return 500 error
    console.error('Error loading games:', error);
    const errorResponse: ApiError = {
      error: 'Failed to load games',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(errorResponse);
  }
});

export default router;


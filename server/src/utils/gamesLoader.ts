/**
 * Games Configuration Loader
 * 
 * This module handles loading and validating the games configuration from games.json.
 * Games are loaded once at server startup and cached in memory.
 */

import fs from 'fs/promises';
import path from 'path';
import { Game } from '../../../shared/types';

// Path to the games configuration file
const GAMES_CONFIG_PATH = path.join(__dirname, '..', '..', 'games.json');

// In-memory cache of loaded games
let cachedGames: Game[] | null = null;

/**
 * Validates that a game object has all required fields
 * 
 * @param game - The game object to validate
 * @returns True if valid, false otherwise
 */
function isValidGame(game: any): game is Game {
  return (
    typeof game === 'object' &&
    game !== null &&
    typeof game.id === 'string' &&
    typeof game.name === 'string' &&
    typeof game.description === 'string' &&
    typeof game.systemPrompt === 'string' &&
    typeof game.thumbnailUrl === 'string'
  );
}

/**
 * Loads all games from the games.json configuration file
 * Results are cached in memory after first load
 * 
 * @returns Array of all available games
 * @throws Error if games.json is missing or invalid
 */
export async function loadGames(): Promise<Game[]> {
  // Return cached games if already loaded
  if (cachedGames !== null) {
    return cachedGames;
  }

  try {
    // Read and parse the games.json file
    const fileContent = await fs.readFile(GAMES_CONFIG_PATH, 'utf-8');
    const games: unknown = JSON.parse(fileContent);

    // Validate that it's an array
    if (!Array.isArray(games)) {
      throw new Error('games.json must contain an array of games');
    }

    // Validate each game object
    for (const game of games) {
      if (!isValidGame(game)) {
        throw new Error(`Invalid game configuration: ${JSON.stringify(game)}`);
      }
    }

    // Cache the validated games
    cachedGames = games;
    return games;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load games configuration: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Finds a specific game by its ID
 * 
 * @param gameId - The ID of the game to find
 * @returns The game if found, undefined otherwise
 */
export async function getGameById(gameId: string): Promise<Game | undefined> {
  const games = await loadGames();
  return games.find((game) => game.id === gameId);
}

/**
 * Reloads the games configuration from disk
 * Useful if games.json is modified while the server is running
 * 
 * @returns Array of all available games
 */
export async function reloadGames(): Promise<Game[]> {
  cachedGames = null; // Clear the cache
  return loadGames();
}


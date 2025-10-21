/**
 * Tests for Games Loader
 * 
 * These tests verify that games are loaded correctly from games.json.
 */

import { getGameById, loadGames, reloadGames } from '../utils/gamesLoader';

describe('Games Loader', () => {
  describe('loadGames', () => {
    it('should load all games from games.json', async () => {
      const games = await loadGames();

      // Should load the 3 placeholder games
      expect(games).toHaveLength(3);

      // Each game should have required fields
      games.forEach((game) => {
        expect(game.id).toBeDefined();
        expect(game.name).toBeDefined();
        expect(game.description).toBeDefined();
        expect(game.systemPrompt).toBeDefined();
        expect(game.thumbnailUrl).toBeDefined();
      });
    });

    it('should cache games after first load', async () => {
      // Load twice
      const games1 = await loadGames();
      const games2 = await loadGames();

      // Should return the same array (cached)
      expect(games1).toBe(games2);
    });

    it('should have expected game IDs', async () => {
      const games = await loadGames();

      const gameIds = games.map((g) => g.id);
      expect(gameIds).toContain('fantasy-quest');
      expect(gameIds).toContain('detective-noir');
      expect(gameIds).toContain('space-explorer');
    });
  });

  describe('getGameById', () => {
    it('should find game by ID', async () => {
      const game = await getGameById('fantasy-quest');

      expect(game).toBeDefined();
      expect(game?.name).toBe('Fantasy Quest');
    });

    it('should return undefined for non-existent game', async () => {
      const game = await getGameById('non-existent-game');

      expect(game).toBeUndefined();
    });
  });

  describe('reloadGames', () => {
    it('should reload games from disk', async () => {
      // Load once
      const games1 = await loadGames();

      // Reload
      const games2 = await reloadGames();

      // Should have loaded fresh data (different array)
      expect(games1).not.toBe(games2);

      // But content should be the same
      expect(games2).toHaveLength(3);
    });
  });
});


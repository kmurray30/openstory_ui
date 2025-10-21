/**
 * Test Setup File
 * 
 * Runs before all tests to set up the testing environment.
 * Imports testing utilities and configures jsdom.
 */

import '@testing-library/jest-dom';

// Mock window.matchMedia (used by some components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});


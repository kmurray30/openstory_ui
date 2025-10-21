/**
 * Jest Configuration
 * 
 * Jest is our testing framework for the backend.
 * This configuration tells Jest how to find and run tests.
 */

module.exports = {
  // Use ts-jest to run TypeScript tests without compiling first
  preset: 'ts-jest',
  
  // We're testing Node.js code (not browser code)
  testEnvironment: 'node',
  
  // Where to find test files
  testMatch: [
    '**/__tests__/**/*.ts',  // Any .ts file in a __tests__ folder
    '**/*.test.ts',          // Any file ending in .test.ts
  ],
  
  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  
  // Coverage settings (shows which code is tested)
  collectCoverageFrom: [
    'src/**/*.ts',           // Include all source files
    '!src/**/*.test.ts',     // Exclude test files
    '!src/**/*.d.ts',        // Exclude type definition files
  ],
  
  // Module path aliases (helps with imports)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};


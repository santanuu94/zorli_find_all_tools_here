/**
 * Jest configuration for Zorli.
 *
 * Goals:
 *  - Run `npm test` successfully against the existing test suite.
 *  - Support TypeScript via ts-jest (or babel-jest fallback).
 *  - Provide a jsdom environment for any DOM-dependent tests.
 *  - Resolve the `@/*` path alias used throughout the project.
 *  - Keep the initial bundle light: only transform code under `src/`.
 */

const path = require('path');

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};

module.exports = config;
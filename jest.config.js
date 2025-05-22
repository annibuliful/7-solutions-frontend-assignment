// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverage: true,
  coverageReporters: ['text', 'json-summary'],
  coverageDirectory: 'coverage-report',
};

module.exports = createJestConfig(customJestConfig);

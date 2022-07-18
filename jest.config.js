module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/__tests__/setup.ts',
  ],
  roots: ['<rootDir>'],
};

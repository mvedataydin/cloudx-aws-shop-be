const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  //setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
  globalSetup: '<rootDir>/.jest/setup.js',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ['<rootDir>'],
};

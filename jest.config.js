module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]s$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/**/*.ts"],
  testRegex: "/src/__tests__/.*\\.test\\.ts$",
  roots: ["<rootDir>"],
};

/**
 * Jest configuration
 */

export default {

  // Indicates whether the coverage information should be collected
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // File extensions to be handled
  moduleFileExtensions: ['js', 'json', 'node'],
};

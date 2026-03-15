import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },

  moduleFileExtensions: ['ts', 'html', 'js', 'json'],

  testMatch: ['**/+(*.)+(spec).+(ts)'],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov', 'json'],

  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/**/*.config.ts',
    '!src/app/**/index.ts',
    '!src/app/main.ts',
  ],

  coverageThreshold: {
    global: {
      statements: 55,
      branches: 30,
      functions: 42,
      lines: 54,
    },
  },

  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
};

export default config;

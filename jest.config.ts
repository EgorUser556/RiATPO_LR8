import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.ts'],
  verbose: true,
  maxWorkers: 1,
  testTimeout: 30000
};

export default config;

// tests/setup/globalEnvSetup.ts
import { setupTestEnv, teardownTestEnv } from './/tests_util.js';

export default async function globalSetup() {
  setupTestEnv();

  // Return a teardown function that Vitest will call after all tests
  return async () => {
    teardownTestEnv();
  };
}
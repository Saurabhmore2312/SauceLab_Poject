import { test, expect } from '@playwright/test';
import { config, credentials } from '../../src/config/env.js';

test('environment configuration is available', async () => {
  expect(config.baseUrl).toBe('https://www.saucedemo.com');
  expect(credentials.username).toBeTruthy();
  expect(credentials.password).toBeTruthy();
});
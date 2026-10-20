import { test, expect } from '@playwright/test';
import { config, credentials } from '../../src/config/env.js';

test('environment configuration is available', async () => {
  expect(config.baseUrl).toBe('https://www.saucedemo.com');
  console.log(credentials.username);
  console.log(credentials.password);
  expect(credentials.username).toBeTruthy();
  expect(credentials.password).toBeTruthy();
});
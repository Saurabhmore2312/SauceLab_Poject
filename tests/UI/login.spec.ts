
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { credentials } from '../../src/config/env.js';
import loginData from '../../src/test-data/loginData.json'
  with { type: 'json' };

test('SauceDemo login page should load successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();

  await expect(page).toHaveTitle('Swag Labs');
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});

test('standard user should log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(
    credentials.username,
    credentials.password
  );

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(
    page.getByText('Products', { exact: true })
  ).toBeVisible();
});

test('invalid password should display an error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(
    loginData.invalidPassword.username,
    loginData.invalidPassword.password
  );

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(
    loginData.invalidPassword.expectedError
  );
});

test('locked out user should display an error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(
    loginData.lockedOutUser.username,
    loginData.lockedOutUser.password
  );

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(
    loginData.lockedOutUser.expectedError
  );
});

test('empty credentials should display an error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(
    loginData.emptyCredentials.username,
    loginData.emptyCredentials.password
  );

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(
    loginData.emptyCredentials.expectedError
  );
});
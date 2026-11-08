
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { credentials } from '../../src/config/env.js';
import loginData from '../../src/test-data/loginData.json' with { type: 'json' };

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
});

test('SauceDemo login page should load successfully', async ({ page }) => {
  await loginPage.navigate();

  await expect(page).toHaveTitle('Swag Labs');
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});

test('FUNC-001 Login with valid standard user', async ({ page }) => {
  await loginPage.navigate();
  await loginPage.login(credentials.username, credentials.password);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('FUNC-002 Login with locked-out user', async () => {
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

test('FUNC-003 Login with invalid username/password', async () => {
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

test('Empty credentials should display an error', async () => {
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

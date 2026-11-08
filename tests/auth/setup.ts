import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { credentials } from '../../src/config/env.js';
import path from 'node:path';


const authFile = path.resolve(
    process.cwd(),
    'playwright/.auth/user.json'
) 

setup('Authenticate with standard user', async({page})=>{
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true }))
        .toBeVisible();

    await page.context().storageState({ path: authFile });

})
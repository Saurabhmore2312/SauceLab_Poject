import {test,expect} from '@playwright/test';

test('SauceDemo login page should load successfully' , async({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
})
import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductsPage.js';
import sortingData from '../../src/test-data/sortingData.json' with { type: 'json' };

    let productPage: ProductPage;

    test.beforeEach(async({page})=>{
        productPage = new ProductPage(page);
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.getByText('Products', { exact: true })).toBeVisible();
    })


test('FUNC-007 - Inventory displays six products and key details',async({page})=>{
    
    await expect(productPage.getpageTitle()).resolves.toEqual('Products');

    for (const name of await productPage.productName.all()) {
    await expect(name).toBeVisible();
    }

    for (const card of await productPage.productCards.all()) {
    await expect(card).toBeVisible();
    }

    for (const desc of await productPage.productDescription.all()) {
    await expect(desc).toBeVisible();
    }

    for (const img of await productPage.productImage.all()) {
    await expect(img).toBeVisible();
    }

    for (const price of await productPage.productPrice.all()) {
    await expect(price).toBeVisible();
    }

    for (const cartButton of await productPage.addToCartButton.all()) {
    await expect(cartButton).toBeVisible();
    }

    await expect(productPage.productCards).toHaveCount(6);
    await expect(productPage.productName).toHaveCount(6);
    await expect(productPage.productDescription).toHaveCount(6);
    await expect(productPage.productImage).toHaveCount(6);
    await expect(productPage.productPrice).toHaveCount(6);

    const productnames = await productPage.getProductName();
    for (const name of productnames){
        await expect(name.trim()).not.toBe('');
    }

    const productDescription = await productPage.getProductDescription();

    for (const description of productDescription){
        await expect(description.trim()).not.toBe('');
    }

    const prices = await productPage.getProductPrices();
    for (const price of prices){
        await expect(price).toBeGreaterThan(0);
    }

})

test('FUNC-008 to 011 - Product Sorting',async({page})=>{
    
    await productPage.sortDropdown.selectOption(sortingData.Values.Aplhabetical);
    let productNames = await productPage.getProductName();
    let sortedNames = [...productNames].sort((a,b) => a.localeCompare(b)); 

    await expect(productNames).toEqual(sortedNames);

    productNames.length = 0;
    sortedNames.length = 0;

    await productPage.sortDropdown.selectOption(sortingData.Values.Reverse_Alphabetical);
    productNames = await productPage.getProductName();
    sortedNames = [...productNames].sort((a,b) => b.localeCompare(a));

    await expect(productNames).toEqual(sortedNames);

    await productPage.sortDropdown.selectOption(sortingData.Values.Price_Low_to_High);
    let productPrices = await productPage.getProductPrices();
    let sortedPrices = [...productPrices].sort((a,b) => a - b);

    await expect(productPrices).toEqual(sortedPrices);

    productPrices.length = 0;
    sortedPrices.length = 0;

    await productPage.sortDropdown.selectOption(sortingData.Values.Price_High_to_Low);
    productPrices = await productPage.getProductPrices();
    sortedPrices = [...productPrices].sort((a,b) => b - a);

    await expect(productPrices).toEqual(sortedPrices);

    await productPage.sortDropdown.selectOption(sortingData.Values.Aplhabetical);

})

test('FUNC-012 - Product details Verification on specific product page', async({page})=>{

    const inventoryitemName = await productPage.productName.first().textContent();
    const inventoryitemDescription = await productPage.productDescription.first().textContent();
    const inventoryitemPrice = await productPage.productPrice.first().textContent();
    const inventoryitemImage = await productPage.productImage.first().getAttribute('src');
    const inventoryitemAddToCartButton = await productPage.addToCartButton.first().textContent();
    

    const specificProductName = productPage.productSpecificName;
    const specificProductDescription = productPage.productSpecificDescription;
    const specificProductPrice = productPage.productSpecificPrice;
    const specificProductImage = productPage.productSpecificImage;
    const specificProductAddToCartButton = productPage.productSpecificAddToCartButton;

    await expect(specificProductName).toBeVisible();
    await expect(specificProductDescription).toBeVisible();
    await expect(specificProductPrice).toBeVisible();
    await expect(specificProductAddToCartButton).toBeVisible();

    await expect(specificProductName).toHaveText(inventoryitemName?.trim() || '');
    await expect(specificProductDescription).toHaveText(inventoryitemDescription?.trim() || '');
    await expect(specificProductPrice).toHaveText(inventoryitemPrice?.trim() || '');
    await expect(specificProductAddToCartButton).toHaveText(inventoryitemAddToCartButton?.trim() || '');

    await productPage.productSpecificBackToInventoryButton.click();
    await expect(page).toHaveURL(/inventory\.html/);    
})

test('FUNC-013 - Add product to cart', async({page})=>{

    await productPage.addToCartButton.first().click();
    const inventoryitemName = await productPage.productName.first().textContent();
    const inventoryitemDescription = await productPage.productDescription.first().textContent();
    const inventoryitemPrice = await productPage.productPrice.first().textContent();
    await expect(productPage.removeFromCartButton.first()).toBeVisible();
    await expect(productPage.cartBadge).toBeVisible();
    await productPage.productName.first().click();

    await productPage.productSpecificBackToInventoryButton.click();
    await expect(productPage.removeFromCartButton).toBeVisible();
    await productPage.cartLink.click();

    const cartitemName = await productPage.productName.first().textContent();
    const cartitemDescription = await productPage.productDescription.first().textContent();
    const cartitemPrice = await productPage.productPrice.first().textContent();

    console.log(cartitemName, cartitemDescription, cartitemPrice);

    await expect(inventoryitemName).toEqual(cartitemName);
    await expect(inventoryitemDescription).toEqual(cartitemDescription);
    await expect(inventoryitemPrice).toEqual(cartitemPrice);

    await expect(productPage.removeFromCartButton).toBeVisible();
 
})

test('FUNC-014 - Remove product from cart', async({page})=>{

    await productPage.addToCartButton.first().click();
    await expect(productPage.cartBadge).toBeVisible();
    await expect(productPage.removeFromCartButton).toBeVisible();

    await productPage.removeFromCartButton.first().click();
    await expect(productPage.cartBadge).toBeHidden();
    await expect(productPage.addToCartButton.first()).toBeVisible();
    await expect(productPage.removeFromCartButton.first()).toBeHidden();

    await productPage.addToCartButton.first().click();
    await productPage.productName.first().click();
    await expect(productPage.cartBadge).toBeVisible();
    await expect(productPage.removeFromCartButton).toBeVisible();
    await expect(productPage.addToCartButton.first()).toBeHidden();

    await productPage.removeFromCartButton.first().click();
    await expect(productPage.cartBadge).toBeHidden();
    await expect(productPage.removeFromCartButton).toBeHidden();
    await expect(productPage.addToCartButton.first()).toBeVisible();

    await productPage.productSpecificBackToInventoryButton.click();

    await productPage.addToCartButton.first().click();
    await productPage.cartLink.click();
    await expect(productPage.cartBadge).toBeVisible();
    await expect(productPage.removeFromCartButton).toBeVisible();
    await expect(productPage.addToCartButton.first()).toBeHidden();

    await productPage.removeFromCartButton.first().click();
    await expect(productPage.cartBadge).toBeHidden();
    await expect(productPage.removeFromCartButton).toBeHidden();
    await expect(productPage.addToCartButton.first()).toBeHidden();
    
})

test('FUNC-015 - Hamburger Menu visibility', async({page})=>{

    await expect(productPage.HamburgerMenuButton).toBeVisible();

    await productPage.HamburgerMenuButton.click();
    await expect(productPage.HamburgerMenuCloseButton).toBeVisible();
    await expect(productPage.HamburgerMenuAllItemsLink).toBeVisible();
    await expect(productPage.HamburgerMenuAboutLink).toBeVisible();
    await expect(productPage.HamburgerMenuLogoutLink).toBeVisible();
    await expect(productPage.HamburgerMenuResetAppStateLink).toBeVisible();
    
    await productPage.HamburgerMenuCloseButton.click();
    await expect(productPage.HamburgerMenuButton).toBeVisible();
    await expect(productPage.HamburgerMenuCloseButton).toBeHidden();
    await expect(productPage.HamburgerMenuAllItemsLink).toBeHidden();
    await expect(productPage.HamburgerMenuAboutLink).toBeHidden();
    await expect(productPage.HamburgerMenuLogoutLink).toBeHidden();
    await expect(productPage.HamburgerMenuResetAppStateLink).toBeHidden();
})
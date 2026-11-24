import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductsPage.js';
import { CartPage } from '../../src/pages/CartPage.js';


let productPage: ProductPage;
let cartPage: CartPage;

    test.beforeEach(async({page})=>{
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.getByText('Products', { exact: true })).toBeVisible();
    })


test('FUNC-016 - Cart shows selected product details', async({page})=>{

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

    const cartitemName = await cartPage.cartItemName.first().textContent();
    const cartitemDescription = await cartPage.cartItemDescription.first().textContent();
    const cartitemPrice = await cartPage.cartItemPrice.first().textContent();

    console.log(cartitemName, cartitemDescription, cartitemPrice);

    await expect(inventoryitemName).toEqual(cartitemName);
    await expect(inventoryitemDescription).toEqual(cartitemDescription);
    await expect(inventoryitemPrice).toEqual(cartitemPrice);

    await expect(productPage.removeFromCartButton).toBeVisible();
 
})

test('FUNC-017 - Cart badge matches selected item count', async({page})=>{

    // await productPage.addToCartButton.first().click();
    const addToCartButton = await productPage.addToCartButton;

    while (await addToCartButton.count() > 0) {
    await addToCartButton.first().click();
}

    await expect(addToCartButton).toHaveCount(0);

    const cartBadgeCount = Number(await productPage.cartBadge.textContent());

    const cartItemsCount = await productPage.removeFromCartButton.count();

    expect(cartBadgeCount).toEqual(cartItemsCount);
 
})

test('FUNC-018 - Remove item from cart', async({page})=>{

     await productPage.addToCartButton.first().click();
     await productPage.addToCartButton.first().click();
     await expect(productPage.removeFromCartButton.first()).toBeVisible();
    await expect(productPage.cartBadge).toBeVisible();
    const cartBadgeCount = Number(await productPage.cartBadge.textContent());
    const cartItemsCount = await productPage.removeFromCartButton.count();

    expect(cartBadgeCount).toEqual(cartItemsCount);

    await productPage.cartLink.click();

    await productPage.removeFromCartButton.first().click();
    const updatedCartBadgeCount = Number(await productPage.cartBadge.textContent());
    const updatedCartItemsCount = await productPage.removeFromCartButton.count();

    expect(updatedCartBadgeCount).toEqual(updatedCartItemsCount);

    expect(cartBadgeCount > updatedCartBadgeCount);

    await productPage.removeFromCartButton.first().click();
    await expect(productPage.cartBadge).toBeHidden();

})

test('FUNC-019 - Continue Shopping returns to inventory', async({page})=>{

    await productPage.cartLink.click();

    await expect(cartPage.continueShoppingButton).toBeVisible();
    await cartPage.continueShoppingButton.click();

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

test.only('FUNC-020 - Cart retains items while navigating within session', async({page})=>{

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
    
    
        await expect(inventoryitemName).toEqual(cartitemName);
        await expect(inventoryitemDescription).toEqual(cartitemDescription);
        await expect(inventoryitemPrice).toEqual(cartitemPrice);
    
        await expect(productPage.removeFromCartButton).toBeVisible();

})

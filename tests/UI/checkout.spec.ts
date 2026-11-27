import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductsPage.js';
import {CartPage} from '../../src/pages/CartPage.js';
import {CheckoutPage} from '../../src/pages/CheckoutPage.js';
import checkoutData from '../../src/test-data/checkouData.json' with { type: 'json' };
import { CheckoutHelper } from '../../Utils/checkout_helper.js';

let productPage: ProductPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let checkoutHelper: CheckoutHelper;


test.beforeEach(async({page})=>{
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutHelper = new CheckoutHelper(page);
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.getByText('Products', { exact: true })).toBeVisible();
    })

test('FUNC-021 - Checkout opens information form', async({page})=>{
    const addToCartButton = await productPage.addToCartButton;
    while (await addToCartButton.count() > 0) {
    await addToCartButton.first().click();
}
    await productPage.cartLink.click();
    await cartPage.checkoutButton.click();
    await checkoutPage.verifyCheckoutPage();
})    

test('FUNC-022,FUNC-023 - Checkout validates each required field', async({page})=>{

    await checkoutHelper.Checkout_Page_Navigation();
    await checkoutPage.verifyCheckoutPage();
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(checkoutData.FirstNameRequired.expectedError);
    await checkoutPage.firstName.fill(checkoutData.LastNameRequired.FirstName);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(checkoutData.LastNameRequired.expectedError);

    await checkoutPage.lastName.fill(checkoutData.PostalCodeRequired.LastName);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(checkoutData.PostalCodeRequired.expectedError);

    await checkoutPage.fillCheckoutInformation(checkoutData.ValidCheckoutInformation.FirstName, checkoutData.ValidCheckoutInformation.LastName, checkoutData.ValidCheckoutInformation.PostalCode);
    await checkoutPage.continueButton.click();
})

test('FUNC-024 - Valid customer details proceed to overview', async({page})=>{
    await checkoutHelper.Checkout_Page_Navigation();
    await checkoutPage.firstName.fill(checkoutData.LastNameRequired.FirstName);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(checkoutData.LastNameRequired.expectedError);

    await checkoutPage.lastName.fill(checkoutData.PostalCodeRequired.LastName);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(checkoutData.PostalCodeRequired.expectedError);

    await checkoutPage.fillCheckoutInformation(checkoutData.ValidCheckoutInformation.FirstName, checkoutData.ValidCheckoutInformation.LastName, checkoutData.ValidCheckoutInformation.PostalCode);
    await checkoutPage.continueButton.click();

    for (const name of await checkoutPage.inventoryItemName.all()) {
            await expect(name).toBeVisible();
            }

    for (const desc of await checkoutPage.inventoryItemDescription.all()) {
            await expect(desc).toBeVisible();
            }

    for (const price of await checkoutPage.inventoryItemPrice.all()) {
            await expect(price).toBeVisible();
            }    

});

test('FUNC-025, FUNC-026 - Overview subtotal equals sum of item prices', async({page})=>{
    
    await checkoutHelper.Checkout_Page_Navigation();

    await checkoutPage.fillCheckoutInformation(checkoutData.ValidCheckoutInformation.FirstName, checkoutData.ValidCheckoutInformation.LastName, checkoutData.ValidCheckoutInformation.PostalCode);
    await checkoutPage.continueButton.click();

    await checkoutPage.subtotal_Calculation();
    
});

test('FUNC-027 - Cancel checkout information returns to cart', async({page})=>{
    
    await checkoutHelper.Checkout_Page_Navigation();

    await checkoutPage.fillCheckoutInformation(checkoutData.ValidCheckoutInformation.FirstName, checkoutData.ValidCheckoutInformation.LastName, checkoutData.ValidCheckoutInformation.PostalCode);
    await checkoutPage.continueButton.click();

    await checkoutPage.checkOutCancelButton.click();
    await expect(productPage.getpageTitle()).resolves.toEqual('Products');
    
});

test('FUNC-028 - Finish order shows confirmation', async({page})=>{
    
    await checkoutHelper.Checkout_Page_Navigation();
    await checkoutPage.fillCheckoutInformation(checkoutData.ValidCheckoutInformation.FirstName, checkoutData.ValidCheckoutInformation.LastName, checkoutData.ValidCheckoutInformation.PostalCode);
    await checkoutPage.continueButton.click();
    await checkoutPage.subtotal_Calculation();
    await checkoutPage.checkOutFinishButton.click();
    await checkoutPage.orderCheckoutConformation();

});





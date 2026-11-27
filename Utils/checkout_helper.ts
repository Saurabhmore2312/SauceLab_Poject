import { type Locator, type Page, expect} from '@playwright/test';
import { ProductPage } from '../src/pages/ProductsPage.js';
import {CartPage} from '../src/pages/CartPage.js';
import {CheckoutPage} from '../src/pages/CheckoutPage.js';
import checkoutData from '../src/test-data/checkouData.json' with { type: 'json' };



export class CheckoutHelper {

private readonly productPage: ProductPage;
private readonly cartPage: CartPage;

    constructor(page: Page) {
        this.productPage = new ProductPage(page);
        this.cartPage = new CartPage(page);
    }


    async Checkout_Page_Navigation(): Promise<void>{
    const addToCartButton = this.productPage.addToCartButton;
    while (await addToCartButton.count() > 0) {
    await addToCartButton.first().click();
    }
    await this.productPage.cartLink.click();
    await this.cartPage.checkoutButton.click();
    }

}
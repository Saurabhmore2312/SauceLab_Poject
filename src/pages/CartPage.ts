import {type Page, type Locator} from '@playwright/test';

export class CartPage {

    readonly page:Page ;
    readonly cartItems: Locator;
    readonly cartItemName: Locator;
    readonly cartItemDescription: Locator;
    readonly cartItemPrice: Locator;
    readonly itemremoveButton: Locator;
    readonly cartBadge: Locator
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;

    constructor(page:Page){
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.cartItemName = page.locator('.inventory_item_name');
        this.cartItemDescription = page.locator('.inventory_item_desc');
        this.cartItemPrice = page.locator('.inventory_item_price');
        this.itemremoveButton = page.getByRole('button', {name: 'Remove'});
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.continueShoppingButton = page.getByRole('button', {name: 'Continue Shopping'});
        this.checkoutButton = page.getByRole('button', {name: 'Checkout'});
    }

}
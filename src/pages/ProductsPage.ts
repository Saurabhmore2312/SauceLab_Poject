import {type Page, type Locator} from '@playwright/test';

export class ProductPage {

    readonly page:Page ;
    readonly productCards: Locator;
    readonly productName: Locator;
    readonly productDescription: Locator;
    readonly productImage: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly pagetitle: Locator;
    readonly sortDropdown:Locator;
    readonly productSpecificName: Locator;
    readonly productSpecificDescription: Locator;
    readonly productSpecificPrice: Locator;
    readonly productSpecificImage: Locator;
    readonly productSpecificAddToCartButton: Locator;
    readonly productSpecificBackToInventoryButton: Locator;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly removeFromCartButton: Locator; 
    readonly HamburgerMenuButton: Locator;
    readonly HamburgerMenuCloseButton: Locator;
    readonly HamburgerMenuAllItemsLink: Locator;
    readonly HamburgerMenuAboutLink: Locator;
    readonly HamburgerMenuLogoutLink: Locator
    readonly HamburgerMenuResetAppStateLink: Locator;


    constructor(page:Page){
        this.page = page;
        this.productCards = page.locator(".inventory_item");
        this.productName = page.locator('.inventory_item_name ');
        this.productDescription = page.locator('.inventory_item_desc');
        this.productImage = page.locator('#inventory_container img.inventory_item_img');
        this.productPrice = page.locator('.inventory_item_price');
        this.addToCartButton = page.getByRole('button', {name: 'Add to cart'});
        this.pagetitle = page.getByText('Products', { exact: true });
        this.sortDropdown = page.locator('.product_sort_container');
        this.productSpecificName = page.locator('.inventory_details_name.large_size');
        this.productSpecificDescription = page.locator('.inventory_details_desc.large_size');
        this.productSpecificPrice = page.locator('.inventory_details_price');
        this.productSpecificImage = page.locator('.inventory_details_img');
        this.productSpecificAddToCartButton = page.getByRole('button', {name: 'Add to cart'});
        this.productSpecificBackToInventoryButton = page.getByRole('button', {name: 'Back to products'});
        this.cartLink = page.locator('.shopping_cart_link');
        this.cartBadge = this.cartLink.locator('.shopping_cart_badge');
        this.removeFromCartButton = page.getByRole('button', {name: 'Remove'});
        this.HamburgerMenuButton = page.locator('#react-burger-menu-btn');
        this.HamburgerMenuCloseButton = page.locator('#react-burger-cross-btn');
        this.HamburgerMenuAllItemsLink = page.locator('#inventory_sidebar_link');
        this.HamburgerMenuAboutLink = page.locator('#about_sidebar_link');
        this.HamburgerMenuLogoutLink = page.locator('#logout_sidebar_link');
        this.HamburgerMenuResetAppStateLink = page.locator('#reset_sidebar_link');
    }

    async getProductCount(): Promise<number> {
        return this.productCards.count();
    }

    async getProductName(): Promise<string[]>{
        return this.productName.allTextContents();
    }

     async getProductDescription(): Promise<string[]>{
        return this.productDescription.allTextContents();
    }

    async getProductPrices(): Promise<number[]>{
        const prices = await this.productPrice.allTextContents();

        return prices.map(price => Number(price.replace('$', '').trim()));
    }

    async getpageTitle(): Promise<string|null> {
        return this.pagetitle.textContent();
    }

    async getSpecificProductName(): Promise<string|null>{ 
        return await this.productSpecificName.textContent();
    }

     async getSpecificProductDescription(): Promise<string|null>{
        return await this.productSpecificDescription.textContent();
    }

    async getSpecificProductPrices(): Promise<number[]>{
        const price = await this.productSpecificPrice.textContent();

        return price ? [Number(price.replace('$', '').trim())] : [];
    }

}

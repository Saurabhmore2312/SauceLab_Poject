import {type Page, type Locator, expect} from '@playwright/test';
import checkoutData from '../../src/test-data/checkouData.json' with { type: 'json' };

export class CheckoutPage {


    readonly page:Page ;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;
    readonly inventoryItemName: Locator;
    readonly inventoryItemDescription: Locator;
    readonly inventoryItemPrice: Locator;
    readonly totalItemPrice: Locator;
    readonly checkOutCancelButton: Locator;
    readonly checkOutFinishButton: Locator;
    readonly completeMessageHeader: Locator;
    readonly completeMessageText: Locator;
    readonly backHomeButton: Locator;

    constructor(page:Page){
        this.page = page;
        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.continueButton = page.getByRole('button', {name: 'Continue'});
        this.cancelButton = page.getByRole('button', {name: 'Cancel'});
        this.errorMessage = page.locator('.error-message-container.error');
        this.inventoryItemName = page.locator('.inventory_item_name');
        this.inventoryItemDescription = page.locator('.inventory_item_desc');
        this.inventoryItemPrice = page.locator('.inventory_item_price');
        this.totalItemPrice = page.locator('.summary_total_label');
        this.checkOutCancelButton = page.getByRole('button', {name: 'Cancel'});
        this.checkOutFinishButton = page.getByRole('button', {name: 'Finish'});
        this.completeMessageHeader = page.locator('.complete-header');
        this.completeMessageText = page.locator('.complete-text');
        this.backHomeButton = page.locator('#back-to-products');
    }

    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    async verifyCheckoutPage(): Promise<void> {
        await expect(this.firstName).toBeVisible();
        await expect(this.lastName).toBeVisible();
        await expect(this.postalCode).toBeVisible();
        await expect(this.continueButton).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
    }

    async subtotal_Calculation(){
        let TotalitemPriceText = await this.totalItemPrice.textContent();
            let TotalitemPrice = Number(TotalitemPriceText?.replace(/[^\d.]/g, ''));
            let itemPriceSum = 0;
        
            for (const priceLocator of await this.inventoryItemPrice.all()) {
            await expect(priceLocator).toBeVisible();
        
            const priceText = await priceLocator.textContent();
            const price = Number(priceText?.replace(/[^\d.]/g, ''));
        
            itemPriceSum += price;
            }
           
              const expectedTotal = Number((itemPriceSum + (itemPriceSum * 0.08)).toFixed(2));
        
            expect(TotalitemPrice).toEqual(expectedTotal);  
    }

    async orderCheckoutConformation(){
        await expect(this.completeMessageHeader).toBeVisible();
        await expect(this.completeMessageHeader).toHaveText(checkoutData.CheckOutMessage.Header);
        await expect(this.completeMessageText).toBeVisible();
        await expect(this.completeMessageText).toHaveText(checkoutData.CheckOutMessage.Text);
        await expect(this.backHomeButton).toBeVisible();
        await this.backHomeButton.click();
        await expect(this.page).toHaveURL(/inventory\.html/);
        await expect(this.page.getByText('Products', { exact: true })).toBeVisible();
    }


}
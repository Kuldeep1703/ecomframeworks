import { test, expect } from '../../fixtures/base.fixture';
import products from '../../test-data/products.json';
import customer from '../../test-data/customer.json';

test.describe('Checkout', () => {
  // Start every test with one item in the cart, sitting on checkout step one.
  test.beforeEach(async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addToCart(products.backpack);
    await productsPage.openCart();
    await cartPage.checkout();
  });

  test('complete an order end to end @smoke', async ({ checkoutPage, page }) => {
    await checkoutPage.fillCustomerInfo(customer.valid);
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('order total is item total plus tax @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillCustomerInfo(customer.valid);
    await checkoutPage.continue();

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(subtotal).toBeGreaterThan(0);
    // toBeCloseTo avoids floating point surprises like 0.1 + 0.2
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('first name is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillCustomerInfo({ lastName: 'Sharma', postalCode: '390001' });
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('last name is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillCustomerInfo({ firstName: 'Rahul', postalCode: '390001' });
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('postal code is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillCustomerInfo({ firstName: 'Rahul', lastName: 'Sharma' });
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('cancel returns to the cart @regression', async ({ checkoutPage, page }) => {
    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
  });
});

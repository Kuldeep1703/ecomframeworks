import { test, expect } from '../../fixtures/base.fixture';
import products from '../../test-data/products.json';

test.describe('Cart', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  test('add one product updates the badge and cart @smoke', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.addToCart(products.backpack);
    await expect(productsPage.cartBadge).toHaveText('1');

    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([products.backpack]);
  });

  test('add multiple products @regression', async ({ productsPage, cartPage }) => {
    await productsPage.addToCart(products.backpack);
    await productsPage.addToCart(products.bikeLight);
    await productsPage.addToCart(products.onesie);
    await expect(productsPage.cartBadge).toHaveText('3');

    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(3);
  });

  test('remove product from the products page @regression', async ({ productsPage }) => {
    await productsPage.addToCart(products.backpack);
    await expect(productsPage.cartBadge).toHaveText('1');

    await productsPage.removeFromCart(products.backpack);
    await expect(productsPage.cartBadge).toBeHidden();
  });

  test('remove product from inside the cart @regression', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.addToCart(products.backpack);
    await productsPage.addToCart(products.bikeLight);
    await productsPage.openCart();

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([products.bikeLight]);
  });

  test('cart items persist after page refresh @regression', async ({
    productsPage,
    page,
  }) => {
    await productsPage.addToCart(products.fleeceJacket);

    await page.reload();

    await expect(productsPage.cartBadge).toHaveText('1');
  });
});

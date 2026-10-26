import { test, expect } from '../../fixtures/base.fixture';
import products from '../../test-data/products.json';

test.describe('Products page', () => {
  // Session is already logged in (storageState), just open the page.
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  test('shows all products @smoke', async ({ productsPage }) => {
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.items).toHaveCount(products.totalProducts);
  });

  test('sort by name A to Z @regression', async ({ productsPage }) => {
    await productsPage.sortBy('az');

    const names = await productsPage.getProductNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sort by name Z to A @regression', async ({ productsPage }) => {
    await productsPage.sortBy('za');

    const names = await productsPage.getProductNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sort by price low to high @regression', async ({ productsPage }) => {
    await productsPage.sortBy('lohi');

    const prices = await productsPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low @regression', async ({ productsPage }) => {
    await productsPage.sortBy('hilo');

    const prices = await productsPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

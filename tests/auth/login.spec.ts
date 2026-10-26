import { test, expect } from '../../fixtures/base.fixture';
import { users } from '../../test-data/users';

// Login tests must start LOGGED OUT, so ignore the saved session here.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ loginPage, productsPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.title).toHaveText('Products');
  });

  test('locked out user sees an error @regression', async ({ loginPage, page }) => {
    await loginPage.login(users.locked.username, users.locked.password);

    await expect(loginPage.errorMessage).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('wrong password shows an error @regression', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, 'wrong_password');

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user'
    );
  });

  test('empty username shows a required error @regression', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('empty password shows a required error @regression', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('user can log out @smoke', async ({ loginPage, productsPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await productsPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('cannot open products page without logging in @regression', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toContainText(
      "You can only access '/inventory.html' when you are logged in"
    );
  });
});

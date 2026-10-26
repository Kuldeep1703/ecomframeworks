import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { users } from '../test-data/users';
import { STORAGE_STATE } from '../utils/constants';

// Runs ONCE before all other tests. Logs in and saves cookies/localStorage
// to a file, so every other test starts already logged in.
setup('login as standard user and save session', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: STORAGE_STATE });
});

# ecom-automation

End-to-end test framework for [SauceDemo](https://www.saucedemo.com) built with **Playwright + TypeScript**.

## Setup

```bash
npm install
npx playwright install        # downloads Chromium, Firefox, WebKit
```

The `.env` file already contains SauceDemo's public demo credentials.

## Run tests

| Command | What it does |
|---|---|
| `npm test` | All tests, all browsers (headless) |
| `npm run test:chromium` | Only Chromium (fastest while learning) |
| `npm run test:smoke` | Only tests tagged `@smoke` |
| `npm run test:regression` | Only tests tagged `@regression` |
| `npm run test:headed` | See the browser while tests run |
| `npm run test:ui` | Playwright UI mode (time travel debugging) |
| `npm run test:debug` | Step through with the Inspector |
| `npm run report` | Open the last HTML report |
| `npm run codegen` | Record actions and get locators |
| `npm run typecheck` | Check TypeScript without running tests |

Run one file: `npx playwright test tests/cart/cart.spec.ts --project=chromium`

## Structure

```
ecom-automation/
├── playwright.config.ts     # browsers, baseURL, retries, reporters, projects
├── .env                     # BASE_URL and credentials
├── pages/                   # Page Object Model, one class per page
│   ├── login.page.ts
│   ├── products.page.ts
│   ├── cart.page.ts
│   └── checkout.page.ts
├── fixtures/
│   └── base.fixture.ts      # custom test() that injects page objects
├── test-data/
│   ├── users.ts             # credentials (read from .env)
│   ├── products.json
│   └── customer.json
├── utils/
│   └── constants.ts         # shared constants (storageState path)
├── tests/
│   ├── auth.setup.ts        # logs in once, saves session
│   ├── auth/login.spec.ts
│   ├── products/products.spec.ts
│   ├── cart/cart.spec.ts
│   └── checkout/checkout.spec.ts
└── .github/workflows/playwright.yml   # CI pipeline
```

## How it works

1. **`setup` project** runs `auth.setup.ts` first. It logs in and saves the session to `.auth/standard-user.json`.
2. **Browser projects** (`chromium`, `firefox`, `webkit`) depend on `setup` and load that saved session, so tests start already logged in.
3. **`login.spec.ts`** overrides the saved session with `test.use({ storageState: ... })` because it must start logged out.
4. **Page objects** hold locators and actions. **Tests** hold the assertions.
5. **Fixtures** hand page objects to tests: `async ({ cartPage }) => ...`.
6. **`testIdAttribute: 'data-test'`** in the config lets `getByTestId('username')` find `[data-test="username"]`.

## Tags

Tests carry `@smoke` or `@regression` in the title. Filter with `--grep @smoke`.

## Next things to try

- Add a `problem_user` test suite (this user has intentional UI bugs)
- Add `@visual` screenshot comparison with `toHaveScreenshot()`
- Add an `auth` fixture for multiple user roles
- Merge fixture files with `mergeTests` as the project grows

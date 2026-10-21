# SauceLab_Poject

## Running tests locally

Create a `.env` file in this directory with the values from `.env.example`, then run:

```bash
npm ci
npx playwright test
```

## GitHub Actions

The Playwright workflow does not need a `.env` file. It uses the `BASE_URL` repository variable when configured, and otherwise defaults to `https://www.saucedemo.com`.

Add these repository Actions secrets under **Settings → Secrets and variables → Actions → New repository secret**:

- `TEST_USERNAME`
- `TEST_PASSWORD`

The workflow supplies these values to the tests as environment variables.
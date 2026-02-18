# Cypress E2E Tests - Pokémon Explorer

## Overview

This directory contains end-to-end tests for the Pokémon Explorer application using Cypress with code coverage tracking.

## Setup

All necessary dependencies have been installed:
- **cypress**: ^15.10.0
- **@cypress/code-coverage**: For collecting code coverage from E2E tests
- **nyc**: For generating coverage reports

## Project Structure

```
cypress/
├── e2e/
│   └── pokemon-explorer.cy.js    # E2E test specifications
├── support/
│   ├── commands.js               # Custom Cypress commands
│   └── index.js                  # Support file with coverage setup
└── cypress.config.js             # Cypress configuration
```

## Available Commands

### Running E2E Tests

**Interactive Mode** (Opens Cypress UI):
```bash
npm run e2e
```

**Headless Mode** (Runs all tests without UI):
```bash
npm run e2e:run
```

**With Coverage Report**:
```bash
npm run e2e:coverage
```

This will:
1. Run all E2E tests in headless mode
2. Generate code coverage data
3. Output a text summary to the terminal
4. Generate an HTML report in `coverage/e2e/`

## Test Coverage

The test suite includes comprehensive validations across the following areas:

### 1. **Page Load and Navigation**
- Verifies the table view loads correctly
- Checks for search input field presence
- Validates pagination controls
- Verifies table headers

### 2. **Search Functionality**
- Tests filtering by Pokémon name
- Validates case-insensitive search
- Handles no results scenario
- Clears search and restores full list

### 3. **Pagination**
- Tests next/previous page navigation
- Maintains pagination state on reload
- Validates rows per page (10 per page)

### 4. **Detail View Navigation**
- Navigates to Pokémon detail page on row click
- Verifies detail view content loads
- Tests back navigation to table

### 5. **Error Handling**
- Tests graceful loading state handling
- Validates content loads after completion

### 6. **Accessibility**
- Checks proper heading hierarchy
- Validates search input accessibility
- Verifies focus indicators
- Ensures descriptive button text

### 7. **Performance and Responsiveness**
- Monitors page load time
- Tests search performance

## Custom Commands

The following custom Cypress commands are available:

```javascript
// Navigate to the Pokémon table view
cy.navigateToPokemonTable()

// Search for a Pokémon by name
cy.searchPokemon('pikachu')

// Navigate to a Pokémon detail page
cy.navigateToPokemonDetail('pikachu')
```

## Configuration

### Cypress Configuration (`cypress.config.js`)
- Base URL: `http://localhost:5173` (Vite dev server)
- Viewport: 1280x720
- Screenshots on failure: Enabled
- Video recording: Disabled (can be enabled)

### Coverage Configuration (`.nycrc.json`)
- Includes: `src/**/*.jsx`, `src/**/*.js`
- Excludes: `src/main.jsx`, test files
- Report format: HTML and text

## Running Tests

### Before Running Tests

1. Start the development server:
   ```bash
   npm run dev
   ```

2. In another terminal, run tests:
   ```bash
   npm run e2e:run
   ```

### Viewing Coverage Reports

After running `npm run e2e:coverage`, open the HTML report:

```bash
open coverage/e2e/index.html
```

## Test Data

Tests use the live PokeAPI data:
- **Base URL**: https://pokeapi.co/api/v2/
- **Page Size**: 10 Pokémon per page
- **Sample Data**: Tests use common Pokémon like Pikachu and Bulbasaur

## Debugging Tests

### Run a Single Test File
```bash
npx cypress run --spec "cypress/e2e/pokemon-explorer.cy.js"
```

### Run Tests in Chrome Browser
```bash
npx cypress run --browser chrome
```

### Run with Verbose Output
```bash
npx cypress run --headed --no-exit
```

## CI/CD Integration

For continuous integration pipelines, use:

```bash
# Run tests and generate coverage
npm run e2e:coverage

# Check test results
# Coverage reports will be in coverage/e2e/
```

## Troubleshooting

**Tests timeout:**
- Ensure the dev server is running on `http://localhost:5173`
- Check network connectivity to PokeAPI
- Increase timeout in `cypress.config.js` if needed

**Coverage not being collected:**
- Ensure `@cypress/code-coverage` is installed
- Check that `cypress/support/index.js` includes the coverage support file
- Run with `--env coverage=true`

**Videos/Screenshots not being saved:**
- These are stored in `cypress/videos/` and `cypress/screenshots/`
- Enable video recording in `cypress.config.js` by setting `video: true`

## Best Practices

1. **Keep tests focused**: Each test should validate one feature
2. **Use descriptive names**: Test names should clearly describe what is being tested
3. **Clean up after tests**: Tests use `beforeEach` to reset state
4. **Handle async operations**: Tests properly wait for elements to appear
5. **Avoid hardcoding**: Use selectors that won't change with styling

## Next Steps

- Add integration tests for error states (API failures)
- Add visual regression tests using Cypress visual tools
- Configure Cypress dashboard for team collaboration
- Add performance benchmarking tests

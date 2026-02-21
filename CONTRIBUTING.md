# Contributing

Thank you for taking the time to contribute. Please read this guide before opening a PR or issue.

---

## Table of contents

- [Development setup](#development-setup)
- [Branch naming](#branch-naming)
- [Commit messages](#commit-messages)
- [Pull request process](#pull-request-process)
- [Testing](#testing)
- [Code style](#code-style)

---

## Development setup

**Prerequisites:** Node.js ≥ 20, npm ≥ 10

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-fork>/ui_test_flywire.git
cd ui_test_flywire

# 2. Install dependencies (also installs Husky git hooks)
npm install

# 3. Start the development server
npm run dev
# → http://localhost:5173

# 4. Run unit tests in watch mode
npm run test

# 5. Run E2E tests (requires the dev server to be running)
npm run e2e
```

---

## Branch naming

All branches must be created from `develop` and follow this convention:

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `refactor/` | Code refactoring (no functional change) |
| `test/` | Adding or updating tests |
| `docs/` | Documentation only |
| `chore/` | Tooling, config, dependency updates |
| `ci/` | CI/CD workflow changes |
| `perf/` | Performance improvements |

Examples: `feat/pokemon-search-filter`, `fix/pagination-off-by-one`, `chore/update-dependencies`

`main` and `develop` are protected — never commit directly to them.

---

## Commit messages

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via Husky + commitlint. Every commit message must follow:

```
<type>(<optional scope>): <subject>

[optional body]

[optional footer]
```

### Allowed types

`feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore` · `perf` · `ci` · `revert`

### Rules

- Subject must be **lowercase**
- Subject must **not** end with a period
- Subject must be **≤ 100 characters**
- Body lines must be **≤ 100 characters**

### Examples

```
feat(search): add debounced pokemon name filter
fix(pagination): correct off-by-one on last page
test(hooks): add unit tests for usePokemonPage
chore(deps): update vitest to v4.1.0
```

The PR title must also follow this convention — it becomes the squash commit message that lands in `develop`.

---

## Pull request process

1. **Create a branch** from `develop` using the naming convention above.
2. **Write tests** for any new behaviour (unit and/or E2E).
3. **Open a PR targeting `develop`** and fill in the PR template completely.
4. **CI must pass** — build, audit, unit tests, E2E tests, and coverage thresholds (≥ 70%).
5. **One approval is required** from a CODEOWNER before merging.
6. **Merge method:** Squash (your commits are squashed into one using the PR title).

For a `develop → main` release PR, the merge method is Rebase (individual commits are preserved).

---

## Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Unit tests in watch mode (Vitest) |
| `npm run test:run` | Unit tests single run |
| `npm run test:coverage` | Unit tests + coverage report (must be ≥ 70% all metrics) |
| `npm run e2e` | Cypress interactive mode (requires dev server) |
| `npm run e2e:run` | Cypress headless run (auto-starts dev server) |
| `npm run e2e:coverage` | E2E run + NYC coverage report |

Coverage reports are written to `./coverage/` and are excluded from git.

---

## Code style

ESLint (flat config, v9) is configured and runs automatically on staged files via lint-staged.

```bash
# Check all files manually
npm run lint

# Auto-fix staged files (also runs automatically on git commit)
npx lint-staged
```

There is no Prettier configured — formatting is handled by ESLint rules.

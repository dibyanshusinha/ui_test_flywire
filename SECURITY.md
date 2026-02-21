# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (`main`) | :white_check_mark: |
| older releases | :x: |

Only the latest commit on `main` receives security fixes. No backport policy exists for prior releases.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Use GitHub's [private vulnerability reporting](../../security/advisories/new) feature to report a vulnerability confidentially. This ensures the issue can be triaged and a fix prepared before public disclosure.

### What to include

A useful report contains:

- A description of the vulnerability and its potential impact
- Steps to reproduce (proof-of-concept code or a minimal reproduction if applicable)
- The affected component(s) and version/commit SHA
- Any suggested mitigations you have already identified

### Response timeline

| Milestone | Target |
|-----------|--------|
| Initial acknowledgement | Within 3 business days |
| Triage and severity assessment | Within 7 business days |
| Fix or mitigation published | Dependent on severity (critical: ASAP, high: within 30 days) |

We will credit you in the release notes unless you prefer to remain anonymous.

## Disclosure policy

This project follows **coordinated disclosure**: once a fix is available, a security advisory will be published with full details. Reporters are encouraged to coordinate the timing of any public disclosure with the maintainers.

## Scope

The following are **in scope**:

- Source code in this repository (`src/`)
- GitHub Actions workflows (`.github/workflows/`)
- Build and dependency configuration (`package.json`, `vite.config.js`)

The following are **out of scope**:

- Vulnerabilities in third-party dependencies already reported upstream (open a Dependabot alert instead)
- Issues in the PokeAPI that this app consumes
- Self-hosted infrastructure not managed in this repository

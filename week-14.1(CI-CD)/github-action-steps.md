<!-- GitHub Actions CI/CD setup notes -->

# GitHub Actions - Simple Notes

## What is GitHub Actions?

- GitHub Actions is a built-in CI/CD tool from GitHub.
- It helps us automate tasks when code changes happen.
- Common events: push, pull request, merge, release.

## Basic workflow file

- Create the file at: `.github/workflows/ci.yml`
- This file contains the automation rules for your project.

## Simple workflow structure

- `name`: name of the workflow
- `on`: event that starts the workflow
- `jobs`: tasks to run
- `runs-on`: operating system for the runner
- `steps`: commands to execute

## Example CI flow for this project

1. Checkout the code
2. Set up Node.js
3. Install dependencies
4. Run lint
5. Run tests

## Example YAML

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm test
```

## Steps to use it

1. Create `.github/workflows/ci.yml`.
2. Paste the YAML above.
3. Commit the file.
4. Push to GitHub.
5. Open the GitHub repository → Actions tab.
6. Check the workflow result.

## Important note

- If the workflow fails, fix the error and push again.
- This project already has lint and test scripts in `package.json`, so the CI flow can use them directly.

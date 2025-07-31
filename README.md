# Playwright Training Project

This document presents a comprehensive training plan for the Playwright practice, detailing targets and ETA for Playwright-BDD practice.

## Timeline

- 3 days

## Features

This project includes:

- 🎭 [Playwright](https://playwright.dev/) for end-to-end browser testing
- ⚡ TypeScript for type safety
- 🧪 Behavior-driven development (BDD) using [Playwright BDD](https://vitalets.github.io/playwright-bdd/)
- 📝 Test scenarios written in Gherkin syntax
  - Login
  - CURD (Create, Update, Read, Delete) for collection users
  - Sort users on the table
  - Search users on the table
- ✅ Assertions for clear expectations
- 🛠️ Debugging tools: Trace Viewer, Inspector, logs
- 📦 `pnpm` as the package manager
- 📊 Custom Playwright configuration in `playwright.config.ts`
- 📏 Linter with [ESLint](https://eslint.org/)
- 💖 Code Formatter with [Prettier](https://prettier.io/)

### Technical Stack

This project uses the following technical stack:

- **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
- **Test Framework:** [Playwright BDD](https://vitalets.github.io/playwright-bdd/)
- **Package Manager:** [pnpm](https://pnpm.js.org/)
- **CI/CD Pipeline:** [GitHub Actions](https://github.com/features/actions)
- **Browser Automation:** [Playwright](https://playwright.dev/)
- **Testing Style:** [Behavior-Driven Development (BDD)](https://en.wikipedia.org/wiki/Behavior-driven_development)
- **Test Syntax:** [Gherkin](https://cucumber.io/docs/gherkin/reference/)
- **Operating System:** Linux, macOS, or Windows
- **Browser Support:** Chromium, Firefox, and WebKit

This technical stack allows for efficient and effective testing of web applications, with a focus on behavior-driven development and browser automation.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The pipeline is defined in `.github/workflows/playwright.yml` and includes the following steps:

- Install dependencies using `pnpm`
- Generate BDD test files using `pnpm bddgen`
- Run Playwright BDD tests using `pnpm exec playwright test`
- Upload test reports to GitHub

## Prerequisites

- [Node.js ^20](https://nodejs.org/en/download/package-manager)
- [pnpm](https://pnpm.io/installation) or [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

## How to Run

### 1. Clone the Project

```bash
git clone <repository-url>
cd training-playwright
git checkout playwright-bdd
```

### 2. Install Dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

### 3. Run Tests

```bash
npx playwright test
# or
pnpm test
# or
yarn test
# or
npm test
```

### 4. Debug & Troubleshooting

- Use `pnpm report` to view cucumber reports
- Use Playwright Inspector for step-by-step debugging

## Project Structure

```shell
.
├── constants/           # Test data and URLs
├── features/            # Gherkin feature files
├── playwright.config.ts # Playwright configuration
├── README.md            # Project documentation
└── ...
```

## Maintainers

- **Nhat Duong Cong** ([nhat.duong@asnet.com.vn](mailto:nhat.duong@asnet.com.vn))
- GitLab: [@nhat.duong](https://gitlab.asoft-python.com/nhat.duong)
- Slack: nhat.duong

### Repo Management

- [GitLab Repo](https://gitlab.asoft-python.com/nhat.duong/playwright-training)

### Responsibilities

- Reviewing and merging pull requests
- Managing and responding to issues
- Updating project documentation
- Ensuring the project is up-to-date with the latest standards and practices

### Availability

Nhat is typically available during weekdays and aims to respond to issues and pull requests within 48 hours. For urgent matters, please email directly.

---

For more details, refer to the official [Playwright documentation](https://playwright.dev/).

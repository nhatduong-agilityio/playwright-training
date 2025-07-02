# Playwright Training Project

This document presents a comprehensive training plan for the Playwright practice, detailing targets and ETA for practice advanced.

## Timeline

- 5 days

## Features

This project includes:

- 🎭 [Playwright](https://playwright.dev/) for end-to-end browser testing
- ⚡ TypeScript for type safety
- 🧪 Test scenarios for:
  - Login
  - CURD (Create, Update, Read, Delete) for collection users
  - Sort users on the table
  - Search users on the table
- ✅ Assertions for clear expectations
- 🛠️ Debugging tools: Trace Viewer, Inspector, logs
- 📏 Linter with [ESLint](https://eslint.org/)
- 💖 Code Formatter with [Prettier](https://prettier.io/)

### Technical Stack

- Playwright [^1.43.0]
- Node.js [^20]
- TypeScript [^5]
- ESLint & Prettier
- pnpm / npm / yarn

## Prerequisites

- [Node.js ^20](https://nodejs.org/en/download/package-manager)
- [pnpm](https://pnpm.io/installation) or [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

## How to Run

### 1. Clone the Project

```bash
git clone <repository-url>
cd training-playwright
git checkout practice-advanced
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

- Use `npx playwright show-report` to view HTML reports
- Use `npx playwright trace open <trace.zip>` for trace debugging
- Use Playwright Inspector for step-by-step debugging

## Project Structure

```shell
.
├── constants/           # Test data and URLs
├── features/            # Gherkin feature files
├── sauce-demo/          # Playwright test specs for Sauce Demo
├── step-definitions/    # Step definitions for Cucumber
├── tests/               # Example Playwright tests
├── tests-examples/      # Additional example tests
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

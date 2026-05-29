# Budgie — Frontend

The React client for the Budgie personal finance application. Built with **React 19**, **TypeScript**, and **Vite**, styled with custom CSS and **Tailwind CSS**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Pages & Routes](#pages--routes)
- [Features](#features)
- [State Management](#state-management)
- [Architecture](#architecture)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5 |
| Build Tool | Vite 7 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Styling | Custom CSS + Tailwind CSS 4 |
| Notifications | React Toastify |
| Error Tracking | Sentry |

---

## Project Structure

```
budgie_frontend/client/
├── src/
│   ├── pages/              # Top-level route components
│   ├── components/         # Shared UI components (Navbar, Modal, DatePicker, etc.)
│   ├── context/            # Global React context providers
│   ├── features/           # Feature modules (api, components, hooks per domain)
│   │   ├── Dashboard/
│   │   ├── auth/
│   │   ├── budget/
│   │   ├── default-budgets/
│   │   ├── expenses/
│   │   ├── fund-transactions/
│   │   ├── income/
│   │   ├── savings-funds/
│   │   └── account-balances/
│   ├── data/
│   │   └── axios.ts        # Configured Axios instance
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Shared utility functions
│   ├── images/             # SVG icons and static images
│   ├── App.tsx             # Root component and router setup
│   └── main.tsx            # Application entry point
├── public/
├── .env                    # Environment variables (not committed)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- The [Budgie backend](../../budgie_backend/README.md) running locally

---

## Installation

```bash
cd budgie_frontend/client
npm install
```

---

## Environment Variables

The app works out of the box with the default backend URL. To override it, create a `.env` file in `budgie_frontend/client/`:

```env
VITE_API_URL=http://localhost:3001/api
```

If this variable is not set, the app defaults to `http://localhost:3001/api`.

---

## Running the App

### Development

```bash
npm run dev
```

The app starts at `http://localhost:5173`.

### Production build

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

---

## Pages & Routes

| Route | Page | Auth Required | Description |
|---|---|---|---|
| `/` | — | — | Redirects to `/dashboard` if authenticated, `/login` otherwise |
| `/login` | `LoginPage` | No | Email + password login form |
| `/register` | `RegisterPage` | No | New account registration form |
| `/dashboard` | `Dashboard` | Yes | Monthly financial overview |
| `/expenses` | `ExpensesPage` | Yes | Expense log for the selected month |
| `/income` | `IncomePage` | Yes | Income log for the selected month |
| `/savings-funds` | `SavingsFundPage` | Yes | Active savings funds and transactions |
| `/archived-savings-funds` | `ArchivedSavingsFundPage` | Yes | Archived savings funds |

All protected routes are wrapped in `ProtectedRoute`, which redirects unauthenticated users to `/login`.

---

## Features

### Dashboard
The main overview page for the selected month. Displays:
- Total income and total expenses
- Remaining budget (income minus expenses minus savings contributions)
- Financial overview (assets minus liabilities minus total savings)
- Category budget progress bars
- Account balance summary
- Savings fund previews
- Quick-add forms for expenses and income

### Expenses
Full CRUD interface for monthly expense entries. Expenses are categorized and feed into the budget tracking on the Dashboard.

### Income
Full CRUD interface for monthly income entries.

### Budget Management
Create and edit monthly budgets with per-category allocations. Supports saving a default budget template to pre-populate future months.

### Savings Funds
Create and manage savings goals (funds). Each fund tracks its own transaction history. Supports:
- Deposits and withdrawals
- Balance transfers between funds
- Manual balance adjustments
- Archiving and unarchiving funds

### Account Balances
Track asset and liability account balances. Used to compute a net financial overview on the Dashboard.

---

## State Management

The app uses **React Context + custom hooks** for global state. Each domain has its own context provider that fetches data from the API and exposes it to the component tree.

| Context | Manages |
|---|---|
| `AuthContext` | Current user, login/logout, session restore on refresh |
| `DateContext` | Selected month (`YYYY-MM-01`) shared across all pages |
| `ExpenseContext` | Expense list and monthly expense total |
| `IncomeContext` | Income list and monthly income total |
| `BudgetContext` | Monthly budget, category budgets |
| `SavingsFundContext` | Active and archived savings funds |
| `FundTransactionContext` | Fund transactions and monthly contribution total |
| `AccountBalanceContext` | Account balances, assets total, liabilities total |

Provider nesting order (outermost first): `AuthProvider` → `DateProvider` → `SavingsFundProvider` → `FundTransactionProvider` → `ExpenseProvider` → `IncomeProvider` → `AccountBalanceProvider` → `BudgetProvider`.

---

## Architecture

Each feature module under `src/features/` follows the same structure:

```
features/<domain>/
├── api/        # Axios calls to the backend
├── components/ # UI components scoped to this feature
└── hooks/      # Custom hooks that wrap context or API calls
```

This keeps API calls, UI, and logic co-located per feature while shared state lives in the top-level `context/` directory. The `pages/` layer composes feature components and contexts into full page views.

Authentication state is restored on every page load by calling `GET /api/auth/me`, which validates the HTTP-only JWT cookie set by the backend — no tokens are stored in `localStorage`.

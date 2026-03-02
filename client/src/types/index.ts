// types/index.ts - Centralized TypeScript type definitions for the entire application.
// All interfaces and types used across features are exported from this single file.
// DTO (Data Transfer Object) interfaces represent the shape of data sent to the API,
// while plain interfaces represent data received from the API.

//---------Authentication---------//
// AuthRequest extends the Express Request object to attach the decoded JWT payload.
export interface AuthRequest extends Request {
    user: {
        userId: number;
        email: string;
        name: string;
    };
}

// Full user record returned from the database.
export interface User {
    id: number;
    email: string;
    passwordHash: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Payload sent to POST /auth/register.
export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
}

// Payload sent to POST /auth/login.
export interface loginDTO {
    email: string;
    password: string;
}

// Response returned by the login and register endpoints.
export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
    }
}


//---------CATEGORIES---------//

// Represents a spending category (e.g. "Groceries", "Rent").
export interface Category {
    id: number,
    name: string,
}

// Payload for creating or updating a category; id is optional for creates.
export interface CategoryDTO{
    id?: number,
    name: string
}


//---------INCOME---------//

// Full income record as returned by the API.
export interface Income {
    id: number,
    amount: number,
    source: string,
    description: string,
    incomeDate: string,
    createdAt: string,
    updatedAt: string
}

// Payload for creating or updating an income entry; id is optional for creates.
export interface IncomeDTO{
    id?: number,
    amount: number,
    source: string,
    description: string,
    incomeDate: string,
}

//---------EXPENSE---------//

// Full expense record as returned by the API, including the resolved category name.
export interface Expense {
    id: number,
    categoryId: number,
    categoryName: string,
    vendor: string,
    amount: number,
    description: string,
    expenseDate: string,
    createdAt: string,
    updatedAt: string
}

// Payload for creating or updating an expense.
// existingCategoryId links the expense to a budget category; null means uncategorized.
export interface ExpenseDTO{
    existingCategoryId: number | null,
    vendor: string,
    amount: number,
    description: string,
    expenseDate: string,
}


//---------MONTHLY BUDGET---------//

// A user's budget plan for a specific month; includes all associated category budgets.
export interface MonthlyBudget{
    id: number, 
    month: string,
    expectedIncome: number,
    categoryBudgets: CategoryBudget[],
    createdAt: string,
    updatedAt: string
}

// Payload for creating or updating a monthly budget, including new category budget entries.
export interface MonthlyBudgetDTO{
    id?: number, 
    month?: string,
    expectedIncome: number,
    categoryBudgetDTOs: CategoryBudgetDTO[],
}


//---------CATEGORY BUDGET---------//

// Represents the budgeted spending limit for a specific category within a monthly budget.
export interface CategoryBudget{
    id: number,
    monthlyBudgetId: number,
    categoryId: number,
    categoryName: string,
    budgetedAmount: number,
    createdAt: string,
    updatedAt: string
}

// Payload for creating or updating a category budget entry.
export interface CategoryBudgetDTO{
    id?: number,
    monthlyBudgetId?: number,
    categoryId?: number,
    categoryName?: string,
    budgetedAmount: number
}



//---------SAVINGS FUNDS---------//

// Represents a savings goal (e.g. "Vacation Fund", "Emergency Fund").
// archivedAt is set when the fund is soft-deleted.
export interface SavingsFund{
    id: number,
    //userId: number,
    name: string,
    goal: number,
    balance: number,
    archivedAt: string
}

// Payload for creating or updating a savings fund.
export interface SavingsFundDTO{
    id?: number,
    name: string,
    goal: number,
    balance?: number,
    archivedAt?: string
}



//---------SAVINGS FUND TRANSACTIONS---------//

// Describes the nature of a movement of money in/out of a savings fund.
export type TransactionType = 'contribution' | 'expenditure' | 'initial_balance' | 'transfer_in' | 'transfer_out' | 'adjustment'

// A single transaction record for a savings fund; relatedFundId is used for transfers between funds.
export interface FundTransaction{
    id: number, 
    savingsFundId: number,
    transactionType: TransactionType,
    amount: number,
    description: string,
    transactionDate: string,
    month: string,
    relatedFundId?: number,
    createdAt: string
}

// Payload for creating a savings fund transaction.
export interface FundTransactionDTO{
    id?: number, 
    savingsFundId: number,
    transactionType: TransactionType,
    amount: number,
    description: string,
    transactionDate: string,
    month: string,
    relatedFundId?: number,
}


//---------ACCOUNT BALANCES---------//

// Classifies a financial account as either an asset (e.g. checking) or liability (e.g. credit card).
export type AccountType = 'Asset' | 'Liability'

// Tracks the current balance of a financial account.
export interface AccountBalance{
    id: number, 
    accountName: string,
    accountType: AccountType,
    balance: number,
    createdAt: string,
    updatedAt: string
}

// Payload for creating or updating an account balance record.
export interface AccountBalanceDTO{
    accountName: string,
    accountType: AccountType,
    balance: number,
}

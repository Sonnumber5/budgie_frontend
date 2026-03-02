// ExpenseContext.tsx - Provides expense list state and CRUD actions for the expenses feature.
// Scoped to the /expenses route via ExpenseProvider in App.tsx so data only loads when needed.
// The actual data-fetching and mutation logic lives in useExpenses.
import { createContext, useContext } from "react";
import type { Expense, ExpenseDTO } from "../types";
import React from "react";
import { useExpenses } from "../features/expenses/hooks/useExpenses";


interface ExpenseContextType {
    expenses: Expense[];
    isLoading: boolean;
    error: string | null;
    addExpense: (data: ExpenseDTO) => Promise<Expense>;
    editExpense: (id: number, data: ExpenseDTO) => Promise<Expense>;
    removeExpense: (id: number) => Promise<void>
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
    const expenses = useExpenses();
    return (
        <ExpenseContext.Provider value={expenses}>
            {children}
        </ExpenseContext.Provider>
    );
};

// useExpenseContext is the public hook for consuming expense state and CRUD actions.
// Throws if used outside of an ExpenseProvider.
export const useExpenseContext = () => {
    const context = useContext(ExpenseContext);
    if (!context){
        throw new Error('useExpenseContext must be within an ExpenseProvider');
    }
    return context;
}
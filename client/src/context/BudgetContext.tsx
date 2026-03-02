// BudgetContext.tsx - Provides monthly budget and category budget state application-wide.
// BudgetProvider is placed at the root (in App.tsx) so budget data is available on all
// protected pages, including the Dashboard and ExpensesPage.
// The actual data-fetching logic lives in useBudgets; this file just wires it into context.
import { createContext, useContext } from "react";
import type { MonthlyBudget, MonthlyBudgetDTO, CategoryBudget, CategoryBudgetDTO, Category } from '../types';
import React from "react";
import { useBudgets } from "../features/budget/hooks/useBudgets";

interface BudgetContextType{
    monthlyBudget: MonthlyBudget | null;
    categoryBudgets: CategoryBudget[];
    availableCategories: Category[];
    isLoading: boolean;
    error: string | null;
    addMonthlyBudget: (data: MonthlyBudgetDTO) => Promise<MonthlyBudget>;
    editMonthlyBudget: (id: number, data: MonthlyBudgetDTO) => Promise<MonthlyBudget>;
    editCategoryBudget: (id: number, data: CategoryBudgetDTO) => Promise<CategoryBudget>;
    removeMonthlyBudget: (id: number) => void;
    removeCategoryBudget: (id: number) => void;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
    const budget = useBudgets();
    return (
        <BudgetContext.Provider value={budget}>
            {children}
        </BudgetContext.Provider>
    )
}

// useBudgetContext is the public hook for consuming budget state and CRUD actions.
// Throws if used outside of a BudgetProvider.
export const useBudgetContext = () => {
    const context = useContext(BudgetContext);
    if (!context){
        throw new Error('useBudgetContext must be within an BudgetProvider');
    }
    return context;
}
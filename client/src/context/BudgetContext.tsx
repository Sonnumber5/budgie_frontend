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
    createMonthlyBudget: (data: MonthlyBudgetDTO) => Promise<MonthlyBudget>;
    updateMonthlyBudget: (id: number, data: MonthlyBudgetDTO) => Promise<MonthlyBudget>;
    updateCategoryBudget: (id: number, data: CategoryBudgetDTO) => Promise<CategoryBudget>;
    deleteMonthlyBudget: (id: number) => void;
    deleteCategoryBudget: (id: number) => void;
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

export const useBudgetContext = () => {
    const context = useContext(BudgetContext);
    if (!context){
        throw new Error('useBudgetContext must be within an BudgetProvider');
    }
    return context;
}
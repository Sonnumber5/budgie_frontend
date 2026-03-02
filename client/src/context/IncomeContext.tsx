// IncomeContext.tsx - Provides income list state and CRUD actions for the income feature.
// Also exposes incomeSum (pre-computed total) to avoid redundant recalculations in components.
// Scoped to the /income route via IncomeProvider in App.tsx.
import { createContext, useContext } from "react";
import type { Income, IncomeDTO } from "../types";
import React from "react";
import { useIncome } from "../features/income/hooks/useIncome";

interface IncomeContextType{
    incomeList: Income[];
    isLoading: boolean;
    error: string | null;
    incomeSum: number;
    addIncome: (data: IncomeDTO) => Promise<Income>;
    editIncome: (id: number, data: IncomeDTO) => Promise<Income>;
    removeIncome: (id: number) => Promise<void>;
}

const IncomeContext = createContext<IncomeContextType | null>(null);

export const IncomeProvider = ({ children }: { children: React.ReactNode }) => {
    const income = useIncome();
    return (
        <IncomeContext.Provider value={income}>
            {children}
        </IncomeContext.Provider>
    )
}

// useIncomeContext is the public hook for consuming income state and CRUD actions.
// Throws if used outside of an IncomeProvider.
export const useIncomeContext = () => {
    const context = useContext(IncomeContext);
    if (!context){
        throw new Error('useIncomeContext must be within an IncomProvider');
    }
    return context;
}
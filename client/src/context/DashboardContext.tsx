// DashboardContext.tsx - Provides high-level financial summary totals for the Dashboard page.
// Exposes monthly income total, expense total, and net remaining balance.
// Scoped to the /dashboard route via DashboardProvider in App.tsx.
import { createContext, useContext } from "react";
import React from "react";
import { useDashboard } from "../features/Dashboard/hooks/useDashboard";

interface DashboardContextType{
    incomeTotal: number;
    expenseTotal: number;
    currentRemaining: number;
    error: string | null;
    isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children } : { children: React.ReactNode }) => {
    const dashboard = useDashboard();
    return (
        <DashboardContext.Provider value={dashboard}>
            {children}
        </DashboardContext.Provider>
    );
}

// useDashboardContext is the public hook for consuming dashboard summary data.
// Throws if used outside of a DashboardProvider.
export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context){
        throw new Error('useDashboardContext must be within a DashboardProvider');
    }
    return context;
}

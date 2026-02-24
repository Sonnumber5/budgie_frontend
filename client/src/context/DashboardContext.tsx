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

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context){
        throw new Error('useDashboardContext must be within a DashboardProvider');
    }
    return context;
}

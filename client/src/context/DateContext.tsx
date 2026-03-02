// DateContext.tsx - Global month selection state shared across all pages.
// currentMonth is stored as "YYYY-MM-01" and used as a filter parameter
// when fetching expenses, income, and budget data from the API.
import { createContext, useContext, useState } from 'react';
import React from 'react';

interface DateContextType {
    currentMonth: string;
    setCurrentMonth: (month: string) => void;
}

const DateContext = createContext<DateContextType | null>(null);

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        // defaults to first day of current month
        return new Date().toISOString().split('T')[0].substring(0, 7) + '-01';
    });

    return (
        <DateContext.Provider value={{ currentMonth, setCurrentMonth }}>
            {children}
        </DateContext.Provider>
    );
};

// useDateContext is the public hook for reading and updating the selected month.
// Throws if used outside of a DateProvider.
export const useDateContext = () => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error('useDate must be used within a DateProvider');
    }
    return context;
};
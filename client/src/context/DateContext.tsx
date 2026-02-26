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

export const useDateContext = () => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error('useDate must be used within a DateProvider');
    }
    return context;
};
// DatePicker.tsx - Month navigation control used on Dashboard and other pages.
// Reads and writes currentMonth via DateContext, which triggers re-fetches in
// all hooks that depend on it (useBudgets, useExpenses, useIncome, useDashboard).
import { useDateContext } from '../context/DateContext';
import './DatePicker.css'

export const MonthPicker = () => {
    const { currentMonth, setCurrentMonth } = useDateContext();

    // decrements the month, wrapping December of the previous year when needed.
    const goToPreviousMonth = () => {
        const parts = currentMonth.split('-');
        const year = Number(parts[0]);
        const month = Number(parts[1]);
        
        let newYear = year;
        let newMonth = month - 1;
        
        if (newMonth === 0) {
            newMonth = 12;
            newYear -= 1;
        }
        
        const formatted = `${newYear}-${String(newMonth).padStart(2, '0')}-01`;
        setCurrentMonth(formatted);
    };
    
    // increments the month, wrapping January of the next year when needed.
    const goToNextMonth = () => {
        const parts = currentMonth.split('-');
        const year = Number(parts[0]);
        const month = Number(parts[1]);
        
        let newYear = year;
        let newMonth = month + 1;
        
        if (newMonth === 13) {
            newMonth = 1;
            newYear += 1;
        }
        
        const formatted = `${newYear}-${String(newMonth).padStart(2, '0')}-01`;
        setCurrentMonth(formatted);
    };

    // Converts the "YYYY-MM-01" date string into this format: "March 2024".
    const displayMonth = (() => {
        const [year, month] = currentMonth.split('-').slice(0, 2).map(Number);
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[month - 1]} ${year}`;
    })();

    return (
        <div className="month-picker">
            <span>{displayMonth}</span>
            <button onClick={goToPreviousMonth}>&lt;</button>
            <button onClick={goToNextMonth}>&gt;</button>
        </div>
    );
};
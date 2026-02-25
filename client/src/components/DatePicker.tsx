// components/MonthPicker.tsx
import { useDate } from '../context/DateContext';
import './DatePicker.css'

export const MonthPicker = () => {
    const { currentMonth, setCurrentMonth } = useDate();

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
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  export function formatMonthDisplay(currentMonth: string): string {
    const [year, month] = currentMonth.split('-').slice(0, 2).map(Number);
    return `${MONTH_NAMES[month - 1]} ${year}`;
  }
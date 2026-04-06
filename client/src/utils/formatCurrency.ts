export const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    
    return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}
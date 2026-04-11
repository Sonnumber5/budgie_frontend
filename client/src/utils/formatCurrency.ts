// Formats a number as a USD currency string, prefixing negative values with a minus sign.
export const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    
    return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}
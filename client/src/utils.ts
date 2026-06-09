// utils.ts - Shared utility functions used across the application.

// formatDate converts an ISO date string to MM/DD/YY display format.
// e.g. "2024-03-15T00:00:00.000Z" → "03/15/24"
export const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${month}/${day}/${year.slice(-2)}`;
};

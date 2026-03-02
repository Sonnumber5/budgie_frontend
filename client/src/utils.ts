// utils.ts - Shared utility functions used across the application.

// formatDate converts an ISO date string to MM/DD/YY display format.
// e.g. "2024-03-15T00:00:00.000Z" → "03/15/24"
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
};

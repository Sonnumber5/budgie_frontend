// dashboard.tsx - API functions for fetching aggregated monthly totals displayed on the Dashboard.
import api from "../../../data/axios";

// Returns the sum of all income entries for the specified month.
export const getIncomeTotal = (month: string) => {
    return api.get(`/income/total?month=${month}`)
}

// Returns the sum of all expense entries for the specified month.
export const getExpenseTotal = (month: string) => {
    return api.get(`/expenses/total?month=${month}`)
}
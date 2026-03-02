// income.ts - API functions for the income endpoints.
import type { IncomeDTO } from "../../../types";
import api from "../../../data/axios";

// Creates a new income entry for the authenticated user.
export const createIncome = (data: IncomeDTO) => {
    return api.post('/income', data);
}

// Fetches all income entries for the given month ("YYYY-MM-01").
export const getIncome = (month: string) => {
    return api.get(`/income?month=${month}`);
}

// Fetches a single income entry by its ID.
export const getIncomeById = (id: number) => {
    return api.get(`/income/${id}`);
}

// Updates an existing income record.
export const updateIncome = (id: number, data: IncomeDTO) => {
    return api.put(`/income/${id}`, data);
}

// Permanently deletes an income entry by its ID.
export const deleteIncome = (id: number) => {
    return api.delete(`/income/${id}`);
}
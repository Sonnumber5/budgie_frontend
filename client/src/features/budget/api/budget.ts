// budget.ts - API functions for the budget and categories endpoints.
import api from '../../../data/axios';
import type { MonthlyBudgetDTO,  CategoryBudgetDTO } from './../../../types/index';

// Creates a new monthly budget with optional category budget entries.
export const createMonthlyBudgetAPI = (data: MonthlyBudgetDTO) => {
    return api.post('/budgets/monthly', data);
}

// Fetches the monthly budget for a given month string ("YYYY-MM-01").
// Returns null/404 if no budget exists for that month yet.
export const getBudgetByMonthAPI = (month: string) => {
    return api.get(`/budgets/monthly?month=${month}`);
}

// Updates the expected income and/or adds new category budgets to an existing monthly budget.
export const updateMonthlyBudgetAPI = (id: number, data: MonthlyBudgetDTO) => {
    return api.put(`/budgets/monthly/${id}`, data);
}

// Updates the budgeted amount (and optionally category) for a single category budget entry.
export const updateCategoryBudgetAPI = (id: number, data: CategoryBudgetDTO) => {
    return api.put(`/budgets/categories/${id}`, data);
}

// Deletes a category budget entry; also removes its associated category on the backend.
export const deleteCategoryBudgetAPI = (id: number) => {
    return api.delete(`/budgets/categories/${id}`);
}

// Deletes an entire monthly budget along with all its category budget entries.
export const deleteMonthlyBudgetAPI = (id: number) => {
    return api.delete(`/budgets/monthly/${id}`);
}

// Retrieves all spending categories available to the user (used for expense categorization).
export const getCategoriesAPI = () => {
    return api.get(`/categories`);
}
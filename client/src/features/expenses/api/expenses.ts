// expenses.ts - API functions for the expenses endpoints.
import type { ExpenseDTO } from "../../../types/index"
import api from "../../../data/axios";

// Creates a new expense entry for the authenticated user.
export const createExpense = (data: ExpenseDTO) => {
    return api.post(`/expenses`, data);
}

// Fetches all expenses for the given month ("YYYY-MM-01").
export const getExpenses = (month: string) => {
    return api.get(`/expenses?month=${month}`);
}

// Fetches a single expense by its ID.
export const getExpenseById = (id: number) => {
    return api.get(`/expenses/${id}`);
}

// Updates an existing expense record and returns the updated expense.
export const updateExpense = (id: number, data: ExpenseDTO) => {
    return api.put(`/expenses/${id}`, data);
}

// Permanently deletes an expense by its ID.
export const deleteExpense = (id: number) => {
    return api.delete(`/expenses/${id}`);
}





































/*
import api from './axios';

export const getExpenses = (month: string) => 
    api.get(`/expenses?month=${month}`);

export const createExpense = (data: ExpenseDTO) => 
    api.post('/expenses', data);

export const updateExpense = (id: number, data: ExpenseDTO) => 
    api.put(`/expenses/${id}`, data);

export const deleteExpense = (id: number) => 
    api.delete(`/expenses/${id}`);
*/
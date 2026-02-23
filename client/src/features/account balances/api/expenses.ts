import type { ExpenseDTO } from "../types";
import api from "./axios";

export const createExpense = (data: ExpenseDTO) => {
    return api.post(`/expenses`, data);
}

export const getExpenses = (month: string) => {
    return api.get(`/expenses?month=${month}`);
}

export const getExpenseById = (id: number) => {
    return api.get(`/expenses/${id}`);
}

export const updateExpense = (id: number, data: ExpenseDTO) => {
    return api.put(`/expenses/${id}`, data);
}

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
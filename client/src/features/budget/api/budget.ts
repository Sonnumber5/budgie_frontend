import api from '../../../data/axios';
import type { MonthlyBudgetDTO,  CategoryBudgetDTO } from './../../../types/index';

export const createMonthlyBudgetAPI = (data: MonthlyBudgetDTO) => {
    return api.post('/budgets/monthly', data);
}

export const getBudgetByMonthAPI = (month: string) => {
    return api.get(`/budgets/monthly?month=${month}`);
}

export const updateMonthlyBudgetAPI = (id: number, data: MonthlyBudgetDTO) => {
    return api.put(`/budgets/monthly/${id}`, data);
}

export const updateCategoryBudgetAPI = (id: number, data: CategoryBudgetDTO) => {
    return api.put(`/budgets/categories/${id}`, data);
}

export const deleteCategoryBudgetAPI = (id: number) => {
    return api.delete(`/budgets/categories/${id}`);
}

export const deleteMonthlyBudgetAPI = (id: number) => {
    return api.delete(`/budgets/monthly/${id}`);
}
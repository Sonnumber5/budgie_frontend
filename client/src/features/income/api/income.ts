import type { IncomeDTO } from "../../../types";
import api from "../../../data/axios";

export const createIncome = (data: IncomeDTO) => {
    return api.post('/income', data);
}

export const getIncome = (month: string) => {
    return api.get(`/income?month=${month}`);
}

export const getIncomeById = (id: number) => {
    return api.get(`/income/${id}`);
}

export const updateIncome = (id: number, data: IncomeDTO) => {
    return api.put(`/income/${id}`, data);
}

export const deleteIncome = (id: number) => {
    return api.delete(`/income/${id}`);
}
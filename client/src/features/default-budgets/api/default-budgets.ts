import api from "../../../data/axios";
import type { DefaultBudgetDTO } from "../../../types";

export const saveDefaultBudgetAPI = (data: DefaultBudgetDTO) => {
    return api.post('/default-budgets', data);
}

export const getDefaultBudgetAPI = () => {
    return api.get('/default-budgets');
}
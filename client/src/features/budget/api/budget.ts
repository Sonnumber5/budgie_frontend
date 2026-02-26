import api from '../../../data/axios';
import type { MonthlyBudgetDTO,  CategoryBudgetDTO } from './../../../types/index';

export const createMonthlyBudget = (data: MonthlyBudgetDTO) => {
    api.create()
}
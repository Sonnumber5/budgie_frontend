import api from "../../../data/axios";

export const getIncomeTotal = (month: string) => {
    return api.get(`/income/total?month=${month}`)
}

export const getExpenseTotal = (month: string) => {
    return api.get(`/expenses/total?month=${month}`)
}
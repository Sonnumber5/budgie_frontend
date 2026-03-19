import api from "../../../data/axios"
import type { AccountBalanceDTO } from "../../../types"

export const createAccountBalance = async (data: AccountBalanceDTO) => {
    return api.post('/account-balances', data);
}

export const getAccountBalances = async () => {
    return api.get('/account-balances');
}

export const updateAccountBalance = async (id: number, data: AccountBalanceDTO) => {
    return api.put(`/account-balances/${id}`, data);
}

export const deleteAccountBalance = async (id: number) => {
    return api.delete(`/account-balances/${id}`);
}

export const resetAccountBalances = async () => {
    return api.put('/account-balances');
}
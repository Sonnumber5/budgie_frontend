import api from "../../../data/axios"
import type { AccountBalanceDTO } from "../../../types"

// Sends a POST request to create a new account balance entry.
export const createAccountBalance = async (data: AccountBalanceDTO) => {
    return api.post('/account-balances', data);
}

// Fetches all account balances for the authenticated user.
export const getAccountBalances = async () => {
    return api.get('/account-balances');
}

// Sends a PUT request to update an existing account balance by ID.
export const updateAccountBalance = async (id: number, data: AccountBalanceDTO) => {
    return api.put(`/account-balances/${id}`, data);
}

// Sends a DELETE request to remove an account balance by ID.
export const deleteAccountBalance = async (id: number) => {
    return api.delete(`/account-balances/${id}`);
}

// Sends a PUT request to reset all account balances to zero.
export const resetAccountBalances = async () => {
    return api.put('/account-balances');
}
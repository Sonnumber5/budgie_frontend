import type { FundTransactionDTO } from "../../../types";
import api from "../../../data/axios";

// Sends a POST request to create a new contribution or expenditure transaction for a fund.
export const createFundTransaction = (data: FundTransactionDTO) => {
    return api.post(`/savings-funds/${data.savingsFundId}/transactions`, data);
}

// Fetches all transactions for a specific fund filtered by month.
export const getFundTransactionsForMonth = (fundId: number, month: string) => {
    return api.get(`/savings-funds/${fundId}/transactions?month=${month}`);
}

// Fetches all transactions for a specific fund with no month filter.
export const getAllTransactionsForFund = (fundId: number) => {
    return api.get(`/savings-funds/${fundId}/transactions`);
}

// Fetches all transactions across all active funds for the authenticated user.
export const getAllTransactionsForActiveFunds = () => {
    return api.get(`/savings-funds/transactions`);
}

// Fetches the total contribution amount across all funds for the given month.
export const getContributionSumForMonth = (month: string) => {
    return api.get(`/savings-funds/contributions?month=${month}`);
}

// Sends a PUT request to update an existing fund transaction.
export const updateFundTransaction = (transactionId: number, data: FundTransactionDTO) => {
    return api.put(`/savings-funds/${data.savingsFundId}/transactions/${transactionId}`, data);
}

// Sends a DELETE request to remove a transaction from a fund.
export const deleteFundTransaction = (fundId: number, transactionId: number) => {
    return api.delete(`/savings-funds/${fundId}/transactions/${transactionId}`);
}

// Sends a POST request to transfer an amount between two funds.
export const createTransferTransaction = (data: { sendingFundId: number, receivingFundId: number, amount: number, month: string }) => {
    return api.post(`/savings-funds/${data.sendingFundId}/transactions/transfer`, {amount: data.amount, relatedFundId: data.receivingFundId, month: data.month});
}

// Sends a POST request to set a fund's balance to an exact amount via an adjustment transaction.
export const createAdjustmentTransaction = (data: { savingsFundId: number, amount: number, month: string }) => {
    return api.post(`/savings-funds/${data.savingsFundId}/transactions/adjustment`, { amount: data.amount, month: data.month });
}
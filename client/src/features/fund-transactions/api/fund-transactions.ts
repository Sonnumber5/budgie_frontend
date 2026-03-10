import type { FundTransactionDTO } from "../../../types";
import api from "../../../data/axios";

export const createFundTransaction = (data: FundTransactionDTO) => {
    return api.post(`/savings-funds/${data.savingsFundId}/transactions`, data);
}

export const getFundTransactionsForMonth = (fundId: number, month: string) => {
    return api.get(`/savings-funds/${fundId}/transactions?month=${month}`);
}

export const getAllTransactionsForFund = (fundId: number) => {
    return api.get(`/savings-funds/${fundId}/transactions`);
}

export const updateFundTransaction = (transactionId: number, data: FundTransactionDTO) => {
    return api.put(`/savings-funds/${data.savingsFundId}/transactions/${transactionId}`);
}

export const deleteFundTransaction = (fundId: number, transactionId: number) => {
    return api.delete(`/savings-funds/${fundId}/transactions/${transactionId}`);
}

export const createTransferTransaction = (sendingFundId: number, relatedFundId: number, amount: number, month: string) => {
    return api.post(`/savings-funds/${sendingFundId}/transactions/transfer`, { relatedFundId, amount, month });
}

export const createAdjustmentTransaction = (fundId: number, amount: number, month: string) => {
    return api.post(`/savings-funds/${fundId}/transactions/adjustment`, { amount, month });
}
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

export const getAllTransactionsForActiveFunds = () => {
    return api.get(`/savings-funds/transactions`);
}

export const getContributionSumForMonth = (month: string) => {
    return api.get(`savings-funds/contributions?month=${month}`);
}

export const updateFundTransaction = (transactionId: number, data: FundTransactionDTO) => {
    return api.put(`/savings-funds/${data.savingsFundId}/transactions/${transactionId}`, data);
}

export const deleteFundTransaction = (fundId: number, transactionId: number) => {
    return api.delete(`/savings-funds/${fundId}/transactions/${transactionId}`);
}

export const createTransferTransaction = (data: { sendingFundId: number, receivingFundId: number, amount: number, month: string }) => {
    return api.post(`/savings-funds/${data.sendingFundId}/transactions/transfer`, {amount: data.amount, relatedFundId: data.receivingFundId, month: data.month});
}

export const createAdjustmentTransaction = (data: { fundId: number, amount: number, month: string }) => {
    return api.post(`/savings-funds/${data.fundId}/transactions/adjustment`, { amount: data.amount, month: data.month });
}
import { useState, useEffect } from "react";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";
import type { FundTransaction, FundTransactionDTO } from "../../../types";
import { createFundTransaction, getAllTransactionsForActiveFunds, getContributionSumForMonth, updateFundTransaction, deleteFundTransaction, createAdjustmentTransaction, createTransferTransaction } from "../api/fund-transactions";
import { useDateContext } from "../../../context/DateContext";
import { useAuth } from "../../../context/AuthContext";

export const useFundTransactions = () => {
    const [ transactions, setTransactions ] = useState<FundTransaction[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ monthlyContributionSum, setMonthlyContributionSum ] = useState(0);
    const { refreshFundInfo } = useSavingsFundContext();
    const { currentMonth } = useDateContext();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated){
            setTransactions([]);
            setMonthlyContributionSum(0);
        }
        const fetchTransactions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getAllTransactionsForActiveFunds();
                setTransactions(response.data.activeFundTransactions || []);
            } catch(error: any) {
                setError(error.response?.data?.error || error.message || 'Failed to fetch transactions');
                console.error('Failed to fetch transactions:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTransactions();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchContributionSumForMonth = async (month: string): Promise<number> => {
            setIsLoading(true);
            setError(null);
            try{
                const result = await getContributionSumForMonth(month); 
                setMonthlyContributionSum(Number(result.data.totalContributions));
                return Number(result.data.totalContributions);
            }catch(error: any){
                setError(error.response?.data?.error || error.message || 'Failed to retrieve contribution sub for the month');
                throw error;
            } finally{
                setIsLoading(false);
            }
        }
        fetchContributionSumForMonth(currentMonth);
    }, [currentMonth]);

    const addFundTransaction = async (data: FundTransactionDTO): Promise<FundTransaction> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createFundTransaction(data);
            const newTransaction = response.data.fundTransaction;
            setTransactions(prev => [...prev, newTransaction]
                .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
            );
            if (data.transactionType === 'contribution') {
                setMonthlyContributionSum(prev => prev + data.amount);
            }
            await refreshFundInfo(data.savingsFundId);
            return newTransaction;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to create transaction');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const editFundTransaction = async (id: number, data: FundTransactionDTO): Promise<FundTransaction> => {
        setIsLoading(true);
        setError(null);
        try {
            const originalTransaction = transactions.find(transaction => transaction.id === id);
            if (!originalTransaction){
                throw new Error(`Transaction with id ${id} not found`);
            }
            const response = await updateFundTransaction(id, data);
            const updatedTransaction = response.data.fundTransaction;
            setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t)
                .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
            );

            const originalIsContribution = originalTransaction.transactionType === 'contribution';
            const newIsContribution = data.transactionType === 'contribution';

            if (originalIsContribution && newIsContribution) {
                setMonthlyContributionSum(prev => (prev - originalTransaction.amount) + data.amount);
            } else if (originalIsContribution && !newIsContribution) {
                setMonthlyContributionSum(prev => prev - originalTransaction.amount);
            } else if (!originalIsContribution && newIsContribution) {
                setMonthlyContributionSum(prev => prev + data.amount);
            }
            await refreshFundInfo(data.savingsFundId);

            return updatedTransaction;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to update transaction');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const removeFundTransaction = async (fundId: number, transactionId: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const originalTransaction = transactions.find(transaction => transaction.id === transactionId);
            if (!originalTransaction){
                throw new Error(`Transaction with id ${transactionId} not found`);
            }
            await deleteFundTransaction(fundId, transactionId);
            setTransactions(prev => prev.filter(t => t.id !== transactionId));
            if (originalTransaction.transactionType === 'contribution') {
                setMonthlyContributionSum(prev => prev - Number(originalTransaction.amount));
            }
            await refreshFundInfo(fundId);
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to delete transaction');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const addTransferTransaction = async (data: { sendingFundId: number, receivingFundId: number, amount: number, month: string }): Promise<FundTransaction[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createTransferTransaction(data);
            const newTransactions = response.data.fundTransactions;
            setTransactions(prev => [...prev, ...newTransactions]
                .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
            );
            await Promise.all([
                refreshFundInfo(data.sendingFundId),
                refreshFundInfo(data.receivingFundId)
            ]);
            return newTransactions;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to transfer funds');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const addAdjustTransaction = async (data: { savingsFundId: number, amount: number, month: string }): Promise<FundTransaction> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createAdjustmentTransaction(data);
            const newTransaction = response.data.fundTransaction;
            setTransactions(prev => [...prev, newTransaction]
                .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
            );
            await refreshFundInfo(data.savingsFundId);
            return newTransaction;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to adjust fund');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        transactions, 
        isLoading, 
        error, 
        monthlyContributionSum,
        addFundTransaction, 
        editFundTransaction, 
        removeFundTransaction, 
        addTransferTransaction, 
        addAdjustTransaction,
        clearError
    }
}
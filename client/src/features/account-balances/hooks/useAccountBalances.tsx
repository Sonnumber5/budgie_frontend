import { useState, useEffect } from "react";
import type { AccountBalance, AccountBalanceDTO } from "../../../types";
import { createAccountBalance, getAccountBalances, resetAccountBalances, updateAccountBalance, deleteAccountBalance } from './../api/account-balances';
import { useDateContext } from "../../../context/DateContext";

export const useAccountBalances = () => {
    const [ accountBalances, setAccountBalances ] = useState<AccountBalance[]>([]);
    const [ error, setError ] = useState<string | null>(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const { currentMonth } = useDateContext();

    useEffect(() => {
        const fetchAccountBalances = async () => {
            try{
                setIsLoading(true);
                setError(null);
                const response = await getAccountBalances();
                setAccountBalances(response.data.accountBalances); 
            } catch(error: any){
                setError(error.response?.data?.error || error.message || 'Failed to fetch account balances');
                console.error('Failed to fetched account balances: ', error);
            } finally{
                setIsLoading(false);
            }
        }
        fetchAccountBalances();
    }, [currentMonth]);

    const addAccountBalance = async (data: AccountBalanceDTO): Promise<AccountBalance> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await createAccountBalance(data);
            setAccountBalances(prev => [...prev, response.data.accountBalance]
                .sort((a, b) => a.accountName.localeCompare(b.accountName))
            );
            return response.data.accountBalance;
        } catch(error: any){
            setError(error.response?.data?.error || error.message || 'Failed to create account balance');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    const editAccountBalance = async (id: number, data: AccountBalanceDTO): Promise<AccountBalance> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await updateAccountBalance(id, data);
            const updatedAccountBalance = response.data.accountBalance;
            setAccountBalances(prev => prev.map(account => account.id === id ? updatedAccountBalance : account)
                .sort((a, b) => a.accountName.localeCompare(b.accountName))
            );
            return updatedAccountBalance;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to update account balance');
            throw error;
        } finally {
            setIsLoading(false); 
        }
    }

    const clearAccountBalances = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await resetAccountBalances();
            setAccountBalances(prev => prev.map(account => ({ ...account, balance: 0 })));
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to reset account balances');
            throw error;
        } finally {
            setIsLoading(false); 
        }
    }

    const removeAccountBalance = async (id: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteAccountBalance(id);
            setAccountBalances(prev => prev.filter(account => account.id !== id));
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to delete account balance');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        accountBalances, isLoading, error, addAccountBalance, editAccountBalance, clearAccountBalances, removeAccountBalance
    }
}

import { useState, useEffect } from "react";
import type { AccountBalance, AccountBalanceDTO } from "../../../types";
import { createAccountBalance, getAccountBalances, resetAccountBalances, updateAccountBalance, deleteAccountBalance } from './../api/account-balances';
import { useDateContext } from "../../../context/DateContext";
import { useAuth } from "../../../context/AuthContext";

export const useAccountBalances = () => {
    const [ accountBalances, setAccountBalances ] = useState<AccountBalance[]>([]);
    const [ assetsTotal, setAssetsTotal ] = useState(0);
    const [ liabilitiesTotal, setLiabilitiesTotal ] = useState(0);
    const [ error, setError ] = useState<string | null>(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const { currentMonth } = useDateContext();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated){
            setAccountBalances([]);
            setAssetsTotal(0);
            setLiabilitiesTotal(0);
        }
        const fetchAccountBalances = async () => {
            try{
                setIsLoading(true);
                setError(null);
                const response = await getAccountBalances();

                const accounts = response.data.accountBalances;
                const assets = accounts.filter((account: AccountBalance) => account.accountType === 'Asset');
                const liabilities = accounts.filter((account: AccountBalance) => account.accountType === 'Liability');
                setAssetsTotal(assets.reduce((sum: number, account: AccountBalance) => sum + Number(account.balance), 0));
                setLiabilitiesTotal(liabilities.reduce((sum: number, account: AccountBalance) => sum + Number(account.balance), 0));

                setAccountBalances(accounts); 
            } catch(error: any){
                setError(error.response?.data?.error || error.message || 'Failed to fetch account balances');
            } finally{
                setIsLoading(false);
            }
        }
        fetchAccountBalances();
    }, [currentMonth, isAuthenticated]);

    const addAccountBalance = async (data: AccountBalanceDTO): Promise<AccountBalance> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await createAccountBalance(data);
            setAccountBalances(prev => [...prev, response.data.accountBalance]
                .sort((a, b) => a.accountName.localeCompare(b.accountName))
            );
            if (data.accountType === 'Asset'){
                setAssetsTotal(prev => prev + Number(data.balance));
            } else{
                setLiabilitiesTotal(prev => prev + Number(data.balance));
            }
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
            const originalAccount = accountBalances.find(account => account.id === id);
            if (!originalAccount){
                throw new Error(`Account balance with id ${id} not found`);
            }
            const response = await updateAccountBalance(id, data);
            const updatedAccountBalance = response.data.accountBalance;
            setAccountBalances(prev => prev.map(account => account.id === id ? updatedAccountBalance : account)
                .sort((a, b) => a.accountName.localeCompare(b.accountName))
            );

            if (originalAccount.accountType === 'Asset' && data.accountType === 'Asset'){
                setAssetsTotal(prev => prev - Number(originalAccount.balance) + Number(data.balance));
            } else if (originalAccount.accountType === 'Asset' && data.accountType === 'Liability'){
                setAssetsTotal(prev => prev - Number(originalAccount.balance));
                setLiabilitiesTotal(prev => prev + Number(data.balance));
            } else if (originalAccount.accountType === 'Liability' && data.accountType === 'Asset'){
                setAssetsTotal(prev => prev + Number(data.balance));
                setLiabilitiesTotal(prev => prev - Number(originalAccount.balance));
            } else if (originalAccount.accountType === 'Liability' && data.accountType === 'Liability'){
                setLiabilitiesTotal(prev => prev - Number(originalAccount.balance) + Number(data.balance));
            }

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
            setLiabilitiesTotal(0);
            setAssetsTotal(0);
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
            const accountToRemove = accountBalances.find(account => account.id === id);
            if (!accountToRemove){
                throw new Error(`Account balance with id ${id} not found`);
            }
            await deleteAccountBalance(id);
            setAccountBalances(prev => prev.filter(account => account.id !== id));
            if (accountToRemove.accountType === 'Asset'){
                setAssetsTotal(prev => prev - Number(accountToRemove.balance));
            } else{
                setLiabilitiesTotal(prev => prev - Number(accountToRemove.balance));
            }
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to delete account balance');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        accountBalances, assetsTotal, liabilitiesTotal, isLoading, error, addAccountBalance, editAccountBalance, clearAccountBalances, removeAccountBalance
    }
}

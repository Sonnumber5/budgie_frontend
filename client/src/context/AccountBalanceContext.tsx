import { createContext, useContext } from "react";
import type { AccountBalance, AccountBalanceDTO } from "../types";
import React from "react";
import { useAccountBalances } from "../features/account-balances/hooks/useAccountBalances";

interface AccountBalanceContextType{
    accountBalances: AccountBalance[];
    assetsTotal: number;
    liabilitiesTotal: number;
    isLoading: boolean;
    error: string | null;
    addAccountBalance: (data: AccountBalanceDTO) => Promise<AccountBalance>;
    editAccountBalance: (id: number, data: AccountBalanceDTO) => Promise<AccountBalance>;
    clearAccountBalances: () => Promise<void>;
    removeAccountBalance: (id: number) => Promise<void>;
}

const AccountBalanceContext = createContext<AccountBalanceContextType | null>(null);

// Provides account balance state and actions to the component tree via context.
export const AccountBalanceProvider = ({ children }: { children: React.ReactNode }) => {
    const accountBalances = useAccountBalances();
    return (
        <AccountBalanceContext.Provider value={accountBalances}>
            {children}
        </AccountBalanceContext.Provider>
    )
}

// useAccountBalances is the public hook for consuming account balance state and CRUD actions.
// Throws if used outside of an AccountBalanceProvider.
export const useAccountBalanceContext = () => {
    const context = useContext(AccountBalanceContext);
    if (!context){
        throw new Error('useAccountBalanceContext must be within an AccountBalanceProvider');
    }
    return context;
}
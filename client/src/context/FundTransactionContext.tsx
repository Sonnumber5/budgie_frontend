import { createContext, useContext } from "react";
import type { FundTransaction, FundTransactionDTO } from "../types";
import { useFundTransactions } from "../features/fund-transactions/hooks/useFundTransactions";

interface FundTransactionContextType {
    transactions: FundTransaction[];
    isLoading: boolean;
    error: string | null;
    addFundTransaction: (data: FundTransactionDTO) => Promise<FundTransaction>;
    editFundTransaction: (id: number, data: FundTransactionDTO) => Promise<FundTransaction>;
    removeFundTransaction: (fundId: number, transactionId: number) => Promise<void>;
    addTransferTransaction: (data: { sendingFundId: number, receivingFundId: number, amount: number, month: string }) => Promise<FundTransaction[]>;
    addAdjustTransaction: (data: { fundId: number, amount: number, month: string }) => Promise<FundTransaction>;
    clearError: () => void;
}

const FundTransactionContext = createContext<FundTransactionContextType | null>(null);

export const FundTransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const fundTransactions = useFundTransactions();
    return (
        <FundTransactionContext.Provider value={fundTransactions}>
            {children}
        </FundTransactionContext.Provider>
    );
};

export const useFundTransactionContext = () => {
    const context = useContext(FundTransactionContext);
    if (!context) {
        throw new Error('useFundTransactionContext must be within a FundTransactionProvider');
    }
    return context;
}
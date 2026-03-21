import { createContext, useContext } from "react";
import type { SavingsFund, SavingsFundDTO } from "../types";
import { useSavingsFunds } from "../features/savings-funds/hooks/useSavingsFunds";


interface SavingsFundContextType{
    activeSavingsFunds: SavingsFund[];
    archivedSavingsFunds: SavingsFund[];
    savingsTotal: number;
    isLoading: boolean;
    error: string | null;
    addSavingsFund: (data: SavingsFundDTO) => Promise<SavingsFund>;
    editSavingsFund: (id: number, data: SavingsFundDTO) => Promise<SavingsFund>;
    fetchArchivedSavingsFunds: () => Promise<SavingsFund[]>;
    removeSavingsFund: (id: number) => Promise<void>;
    archiveSavingsFund: (id: number) => Promise<void>;
    refreshFundInfo: (fundId: number) => Promise<void>;
}

const SavingsFundContext = createContext<SavingsFundContextType | null>(null);

export const SavingsFundProvider = ({ children }: { children: React.ReactNode }) => {
    const savingsFunds = useSavingsFunds();
    return (
        <SavingsFundContext.Provider value={savingsFunds}>
            { children }
        </SavingsFundContext.Provider>
    );
};

export const useSavingsFundContext = () => {
    const context = useContext(SavingsFundContext);
    if (!context){
        throw new Error('useSavingsFundContext must be within a SavingsFundProvider');
    }
    return context;
}
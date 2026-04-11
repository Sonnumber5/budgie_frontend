import { useState, useEffect } from "react";
import type { SavingsFund, SavingsFundDTO } from "../../../types/index";
import { createSavingsFund, getActiveSavingsFunds, getSavingsFundById, getArchivedSavingsFunds, updateSavingsFund, archiveSavingsFundAPI, deleteSavingsFund } from '../api/savings-funds';
import { useAuth } from "../../../context/AuthContext";

// Hook that manages savings fund state and exposes CRUD actions for active and archived funds.
export const useSavingsFunds = () => {
    const [ activeSavingsFunds, setActiveSavingsFunds ] = useState<SavingsFund[]>([]);
    const [ archivedSavingsFunds, setArchivedSavingsFunds ] = useState<SavingsFund[]>([]);
    const [ savingsTotal, setSavingsTotal ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            setActiveSavingsFunds([]);
            setArchivedSavingsFunds([]);
            setSavingsTotal(0);
            return;
        }
        const fetchActiveSavingsFunds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getActiveSavingsFunds();
                const activeFunds = response.data.savingsFunds;
                const fundSum = (activeFunds || []).reduce((sum: number, fund: SavingsFund) => sum + Number(fund.balance ?? 0), 0)
                setSavingsTotal(fundSum);

                setActiveSavingsFunds(activeFunds || []); 
            } catch(error: any) {
                setError(error.response?.data?.error || error.message || 'Failed to fetch active savings funds');
            } finally {
                setIsLoading(false);
            }
        }
        fetchActiveSavingsFunds();
    }, [isAuthenticated]);

    // Fetches the latest data for a single fund and updates it in local state.
    const refreshFundInfo = async (fundId: number) => {
        try {
            const response = await getSavingsFundById(fundId);
            const updatedFund = response.data.savingsFund;
            setActiveSavingsFunds(prev => {
                const exists = prev.some(fund => fund.id === fundId);
                if (!exists) return prev;
                const originalFund = prev.find(fund => fund.id === fundId);
                setSavingsTotal(prevTotal => prevTotal - Number(originalFund?.balance ?? 0) + Number(updatedFund.balance ?? 0));
                return prev.map(fund => fund.id === fundId ? updatedFund : fund);
            });
        } catch(error: any) {
            if (error.response?.status === 404) return;
            setError(error.response?.data?.error || error.message || 'Failed to retrieve fund');
            throw error;
        }
    }

    // Creates a new savings fund and appends it to the active list sorted by name.
    const addSavingsFund = async (data: SavingsFundDTO): Promise<SavingsFund> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createSavingsFund(data);
            setActiveSavingsFunds(prev => [...prev, response.data.savingsFund]
                .sort((a, b) => a.name.localeCompare(b.name))
            );
            return response.data.savingsFund;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to create savings fund');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // Updates a savings fund's name or goal and refreshes the active list.
    const editSavingsFund = async (id: number, data: SavingsFundDTO): Promise<SavingsFund> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await updateSavingsFund(id, data);
            const updatedFund = response.data.savingsFund;
            setActiveSavingsFunds(prev => prev.map(fund => fund.id === id ? updatedFund : fund)
                .sort((a, b) => a.name.localeCompare(b.name))
            );
            return updatedFund;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to update savings fund');
            throw error;
        } finally {
            setIsLoading(false); 
        }
    }

    // Fetches all archived savings funds and stores them in local state.
    const fetchArchivedSavingsFunds = async (): Promise<SavingsFund[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getArchivedSavingsFunds();
            setArchivedSavingsFunds(response.data.savingsFunds || []);
            return response.data.savingsFunds;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to retrieve archived savings funds');
            throw error;
        } finally {
            setIsLoading(false); 
        }
    }

    // Permanently deletes a savings fund and removes it from the active list.
    const removeSavingsFund = async (id: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteSavingsFund(id);
            setActiveSavingsFunds(prev => prev.filter(fund => fund.id !== id));
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Unable to delete savings fund');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // Archives a savings fund and removes it from the active list.
    const archiveSavingsFund = async (id: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await archiveSavingsFundAPI(id);
            setActiveSavingsFunds(prev => prev.filter(fund => fund.id !== id));
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Unable to archive savings fund');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { 
        activeSavingsFunds, 
        archivedSavingsFunds, 
        isLoading, 
        error, 
        savingsTotal,
        addSavingsFund, 
        editSavingsFund, 
        fetchArchivedSavingsFunds, 
        removeSavingsFund,
        archiveSavingsFund,
        refreshFundInfo
    }
}
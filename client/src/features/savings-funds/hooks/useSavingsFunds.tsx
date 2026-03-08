import { useState, useEffect } from "react";
import type { SavingsFund, SavingsFundDTO } from "../../../types/index";
import { createSavingsFund, getActiveSavingsFunds, getArchivedSavingsFunds, updateSavingsFund, deleteSavingsFund } from '../api/savings-funds'

export const useSavingsFunds = () => {
    const [ activeSavingsFunds, setActiveSavingsFunds ] = useState<SavingsFund[]>([]);
    const [ archivedSavingsFunds, setArchivedSavingsFunds ] = useState<SavingsFund[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchActiveSavingsFunds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getActiveSavingsFunds();
                setActiveSavingsFunds(response.data.savingsFunds || []); 
            } catch(error: any) {
                setError(error.response?.data?.error || error.message || 'Failed to fetch active savings funds');
                console.error('Failed to fetch savings funds:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchActiveSavingsFunds();
    }, []);

    const addSavingsFund = async (data: SavingsFundDTO): Promise<SavingsFund> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createSavingsFund(data);
            setActiveSavingsFunds(prev => [...prev, response.data.savingsFund]);
            return response.data.savingsFund;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to create savings fund');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const editSavingsFund = async (id: number, data: SavingsFundDTO): Promise<SavingsFund> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await updateSavingsFund(id, data);
            const updatedFund = response.data.savingsFund;
            setActiveSavingsFunds(prev => prev.map(fund => fund.id === id ? updatedFund : fund));
            return updatedFund;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to update savings fund');
            throw error;
        } finally {
            setIsLoading(false); 
        }
    }

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

    const removeSavingsFund = async (id: number): Promise<void> => { 
        setIsLoading(true);
        setError(null);
        try {
            await deleteSavingsFund(id);
            setActiveSavingsFunds(prev => prev.filter(fund => fund.id !== id));
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Unable to remove savings fund');
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
        addSavingsFund, 
        editSavingsFund, 
        fetchArchivedSavingsFunds, 
        removeSavingsFund
    }
}
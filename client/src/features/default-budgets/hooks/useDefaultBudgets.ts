import { useState } from "react";
import type { DefaultBudget, DefaultBudgetDTO } from "../../../types";
import { saveDefaultBudgetAPI, getDefaultBudgetAPI } from "../api/default-budgets";

export const useDefaultBudgets = () => {
    const [ isSaveLoading, setIsSaveLoading ] = useState(false);
    const [ isLoadLoading, setIsLoadLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ defaultBudget, setDefaultBudget ] = useState<DefaultBudget | null>(null);

    const saveDefaultBudget = async (data: DefaultBudgetDTO): Promise<void> => {
        setIsSaveLoading(true);
        setError(null);
        try{
            const response = await saveDefaultBudgetAPI(data);
            setDefaultBudget(response.data.defaultBudget);
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to save default budget');
            throw error; 
        } finally{
            setIsSaveLoading(false);
        }
    }

    const getDefaultBudget = async (): Promise<DefaultBudget> => {
        setIsLoadLoading(true);
        setError(null);
        try{
            const response = await getDefaultBudgetAPI();
            setDefaultBudget(response.data.defaultBudget);

            return response.data.defaultBudget;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to retrieve default budget');
            throw error; 
        } finally{
            setIsLoadLoading(false);
        }
    }

    return {
        defaultBudget, saveDefaultBudget, getDefaultBudget, isSaveLoading, isLoadLoading, error
    }
}
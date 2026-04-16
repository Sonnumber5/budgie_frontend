import { useState } from "react";
import type { DefaultBudget, DefaultBudgetDTO } from "../../../types";
import { saveDefaultBudgetAPI, getDefaultBudgetAPI } from "../api/default-budgets";

export const useDefaultBudgets = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ defaultBudget, setDefaultBudget ] = useState<DefaultBudget | null>(null)

    const saveDefaultBudget = async (data: DefaultBudgetDTO): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await saveDefaultBudgetAPI(data);
            setDefaultBudget(response.data.defaultBudget);
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to save default budget');
            throw error; 
        } finally{
            setIsLoading(false);
        }
    }

    const getDefaultBudget = async (): Promise<DefaultBudget> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await getDefaultBudgetAPI();
            setDefaultBudget(response.data.defaultBudget);

            return response.data.defaultBudget;
        } catch(error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to retrieve default budget');
            throw error; 
        } finally{
            setIsLoading(false);
        }
    }

    return {
        defaultBudget, saveDefaultBudget, getDefaultBudget, isLoading, error
    }
}
import { useState, useEffect } from "react";
import type { Income, IncomeDTO } from "../../../types";
import { useDate } from "../../../context/DateContext";
import { createIncome, getIncome, getIncomeById, updateIncome, deleteIncome } from './../api/income';

export const useIncome = () => {
    const { currentMonth } = useDate();
    const [ income, setIncome ] = useState<Income[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchIncome = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const response = await getIncome(currentMonth);
                setIncome(response.data.income);
            } catch(error: any){
                setError(error.message || 'Failed to fetch income')
            } finally{
                setIsLoading(false);
            }
        }
        fetchIncome();
    }, [currentMonth]);

    const addIncome = async (data: IncomeDTO): Promise<Income> => {
        try{
            const response = await createIncome(data);
            setIncome(prev => [...prev, response.data.income]);
            return response.data.income;
        } catch(error: any){
            setError(error.message || 'Failed to create income');
            throw error;
        }
    }

    const removeIncome = async (id: number): Promise<void> => {
        try{
            await deleteIncome(id);
            setIncome(prev => prev.filter(i => i.id !== id));
        } catch(error: any){
            setError(error.message || 'Failed to delete income');
            throw error;
        }
    }

    const editIncome = async (id: number, data: IncomeDTO): Promise<Income> => {
        try{
            const response = await updateIncome(id, data);
            setIncome(prev => prev.map(i => i.id === id ? response.data.income : i));
            return response.data.income;
        } catch(error: any){
            setError(error.message || 'Failed to update income');
            throw error;
        }
    }

    return {
        income, isLoading, error, addIncome, editIncome, removeIncome
    }
}
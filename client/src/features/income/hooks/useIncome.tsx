// useIncome.tsx - Custom hook managing income list state, running total, and CRUD operations.
// incomeSum is kept in sync locally to avoid recalculating from the array on every render.
// Re-fetches income and recomputes the total whenever the selected month changes.
import { useState, useEffect } from "react";
import type { Income, IncomeDTO } from "../../../types";
import { useDateContext } from "../../../context/DateContext";
import { createIncome, getIncome, getIncomeTotal, getIncomeById, updateIncome, deleteIncome } from './../api/income';

export const useIncome = () => {
    const { currentMonth } = useDateContext();
    const [ incomeList, setIncomeList ] = useState<Income[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ incomeSum, setIncomeSum ] = useState(0);

    useEffect(() => {
        const fetchIncome = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const [ response, sumResponse ] = await Promise.all([
                    getIncome(currentMonth),
                    getIncomeTotal(currentMonth)
                ])
                setIncomeList(response.data.income);
                setIncomeSum(Number(sumResponse.data.incomeSum));
            } catch(error: any){
                setError(error.message || 'Failed to fetch income')
            } finally{
                setIsLoading(false);
            }
        }
        fetchIncome();
    }, [currentMonth]);

    // addIncome posts a new income entry and adds its amount to the running incomeSum.
    const addIncome = async (data: IncomeDTO): Promise<Income> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await createIncome(data);
            setIncomeList(prev => [...prev, response.data.income]);
            setIncomeSum(prev => prev + data.amount);
            return response.data.income;
        } catch(error: any){
            setError(error.message || 'Failed to create income');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    // removeIncome deletes the entry and subtracts its amount from incomeSum.
    const removeIncome = async (id: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try{
            const originalIncome = incomeList.find(income => income.id === id);
            if (!originalIncome){
                throw new Error(`Income with id ${id} not found`);
            }
            await deleteIncome(id);
            setIncomeList(prev => prev.filter(i => i.id !== id));
            setIncomeSum(prev => prev - originalIncome.amount);
        } catch(error: any){
            setError(error.message || 'Failed to delete income');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    // editIncome updates the income record and adjusts incomeSum by the delta
    // between the old and new amounts so the total stays accurate.
    const editIncome = async (id: number, data: IncomeDTO): Promise<Income> => {
        setIsLoading(true);
        setError(null);
        try{
            const originalIncome = incomeList.find(income => income.id === id);
            if (!originalIncome){
                throw new Error(`Income with id ${id} not found`);
            }
            const response = await updateIncome(id, data);
            setIncomeList(prev => prev.map(i => i.id === id ? response.data.income : i));
            setIncomeSum(prev => (prev - originalIncome.amount) + data.amount);
            return response.data.income;
        } catch(error: any){
            setError(error.message || 'Failed to update income');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    return {
        incomeSum, incomeList, isLoading, error, addIncome, editIncome, removeIncome
    }
}
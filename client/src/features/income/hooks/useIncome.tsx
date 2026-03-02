// useIncome.tsx - Custom hook managing income list state, running total, and CRUD operations.
// incomeSum is kept in sync locally to avoid recalculating from the array on every render.
// Re-fetches income and recomputes the total whenever the selected month changes.
import { useState, useEffect } from "react";
import type { Income, IncomeDTO } from "../../../types";
import { useDateContext } from "../../../context/DateContext";
import { createIncome, getIncome, getIncomeById, updateIncome, deleteIncome } from './../api/income';

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
                const response = await getIncome(currentMonth);
                setIncomeList(response.data.income);
                const total = response.data.income.reduce((sum: number, item: Income) => {
                    return sum + Number(item.amount);
                }, 0);
                setIncomeSum(total);
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
        try{
            const response = await createIncome(data);
            setIncomeList(prev => [...prev, response.data.income]);
            setIncomeSum((prev) => prev + Number(response.data.income.amount))
            return response.data.income;
        } catch(error: any){
            setError(error.message || 'Failed to create income');
            throw error;
        }
    }

    // removeIncome deletes the entry and subtracts its amount from incomeSum.
    const removeIncome = async (id: number): Promise<void> => {
        try{
            await deleteIncome(id);
            const incomeToRemove = incomeList.find(i => i.id === id);
            setIncomeList(prev => prev.filter(i => i.id !== id));
            
            if (incomeToRemove){
                setIncomeSum(prev => prev - Number(incomeToRemove.amount));
            }
        } catch(error: any){
            setError(error.message || 'Failed to delete income');
            throw error;
        }
    }

    // editIncome updates the income record and adjusts incomeSum by the delta
    // between the old and new amounts so the total stays accurate.
    const editIncome = async (id: number, data: IncomeDTO): Promise<Income> => {
        try{
            const originalIncome = incomeList.find(i => i.id === id);
            const response = await updateIncome(id, data);
            const updatedIncome = response.data.income;
            
            setIncomeList(prev => prev.map(i => i.id === id ? updatedIncome : i));
            if (originalIncome){
                setIncomeSum(prev => prev - Number(originalIncome.amount) + Number(updatedIncome.amount));
            }
            
            return updatedIncome;
        } catch(error: any){
            setError(error.message || 'Failed to update income');
            throw error;
        }
    }

    return {
        incomeSum, incomeList, isLoading, error, addIncome, editIncome, removeIncome
    }
}
// useExpenses.ts - Custom hook managing expense list state and CRUD operations.
// Re-fetches expenses automatically whenever the selected month changes.
import { useState, useEffect } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses';
import type { Expense, ExpenseDTO } from "../../../types";
import { useDateContext } from '../../../context/DateContext';

export const useExpenses = () => {
    const { currentMonth } = useDateContext();
    const [ expenses, setExpenses ] = useState<Expense[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    useEffect (() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const response = await getExpenses(currentMonth);
                setExpenses(response.data.expenses || []);
            } catch(error: any){
                setError(error.message || 'Failed to fetch expenses');
                console.error('Failed to fetch expenses:', error);
            } finally{
                setIsLoading(false);
            }
        };
        fetchExpenses(); 
    }, [currentMonth]);

    const addExpense = async (data: ExpenseDTO): Promise<Expense> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await createExpense(data);
            setExpenses(prev => [...prev, response.data.expense]);
            return response.data.expense;
        } catch(error: any){
            setError(error.message || 'Failed to create expense');
            throw error;
        } finally{
            setIsLoading(false);
        }
    };

    const editExpense = async (id: number, data: ExpenseDTO): Promise<Expense> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await updateExpense(id, data);
            setExpenses(prev => prev.map(e => e.id === id ? response.data.expense : e));
            return response.data.expense;
        } catch(error: any){
            setError(error.message || 'Failed to update expense');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    const removeExpense = async (id: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try{
            await deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch(error: any){
            setError(error.message || 'Failed to delete expense');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    return {
        expenses, isLoading, error, addExpense, editExpense, removeExpense
    }
}
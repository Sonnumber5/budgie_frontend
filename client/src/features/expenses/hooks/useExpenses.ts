import { useState, useEffect } from "react";
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from '../api/expenses';
import type { Expense, ExpenseDTO } from "../../account-balances/types";
import { useDate } from '../../../context/DateContext';

export const useExpenses = () => {
    const { currentMonth } = useDate();
    const [ expenses, setExpenses ] = useState<Expense[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    useEffect (() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const response = await getExpenses(currentMonth);
                setExpenses(response.data.expenses);
            } catch(error: any){
                setError(error.message || 'Failed to fetch expenses');
            } finally{
                setIsLoading(false);
            }
        };
        fetchExpenses(); 
    }, [currentMonth]);

    const addExpense = async (data: ExpenseDTO) => {
        try{
            const response = await createExpense(data);
            setExpenses(prev => [...prev, response.data.expense]);
        } catch(error: any){
            setError(error.message || 'Failed to create expense');
        }
    };

    const editExpense = async (id: number, data: ExpenseDTO) => {
        try{
            const response = await updateExpense(id, data);
            setExpenses(prev => prev.map(e => e.id === id ? response.data.expense : e))
        } catch(error: any){
            setError(error.message || 'Failed to update expense');
        }
    }

    const removeExpense = async (id: number) => {
        try{
            await deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch(error: any){
            setError(error.message || 'Failed to delete expense');
        }
    }

    return {
        expenses, isLoading, error, addExpense, editExpense, removeExpense
    }
}
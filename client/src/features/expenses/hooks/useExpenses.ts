// useExpenses.ts - Custom hook managing expense list state and CRUD operations.
// Re-fetches expenses automatically whenever the selected month changes.
import { useState, useEffect } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseTotal } from '../api/expenses';
import type { Expense, ExpenseDTO } from "../../../types";
import { useDateContext } from '../../../context/DateContext';
import { useAuth } from "../../../context/AuthContext";

export const useExpenses = () => {
    const { currentMonth } = useDateContext();
    const [ expenses, setExpenses ] = useState<Expense[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ expenseSum, setExpenseSum ] = useState(0);
    const { isAuthenticated } = useAuth();

    const fetchExpenses = async () => {
        if (!isAuthenticated) {
            setExpenses([]);
            setExpenseSum(0);
            return;
        }
        setIsLoading(true);
        setError(null);
        try{
            const [ response, sumResponse ] = await Promise.all([
                getExpenses(currentMonth),
                getExpenseTotal(currentMonth)
            ]);
            setExpenses(response.data.expenses || []);
            setExpenseSum(Number(sumResponse.data.expenseSum));
        } catch(error: any){
            setError(error.response?.data?.error || error.message || 'Failed to fetch expenses');
        } finally{
            setIsLoading(false);
        }
    };

    useEffect (() => {
        fetchExpenses(); 
    }, [currentMonth, isAuthenticated]);

    const addExpense = async (data: ExpenseDTO): Promise<Expense> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await createExpense(data);
            setExpenses(prev => [...prev, response.data.expense]
                .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
            );
            setExpenseSum(prev => Number(prev) + Number(data.amount));
            return response.data.expense;
        } catch(error: any){
            setError(error.response?.data?.error || error.message || 'Failed to create expense');
            throw error;
        } finally{
            setIsLoading(false);
        }
    };

    const editExpense = async (id: number, data: ExpenseDTO): Promise<Expense> => {
        setIsLoading(true);
        setError(null);
        try{
            const originalExpense = expenses.find(expense => 
                expense.id === id
            );
            if (!originalExpense) {
                throw new Error(`Expense with id ${id} not found`);
            }
            const response = await updateExpense(id, data);
            setExpenses(prev => prev.map(e => e.id === id ? response.data.expense : e)
                .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
            );
            setExpenseSum(prev => (Number(prev) - Number(originalExpense.amount)) + Number(data.amount))
            return response.data.expense;
        } catch(error: any){
            setError(error.response?.data?.error || error.message || 'Failed to update expense');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    const removeExpense = async (id: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try{
            const originalExpense = expenses.find(expense => 
                expense.id === id
            );
            if (!originalExpense) {
                throw new Error(`Expense with id ${id} not found`);
            }
            await deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
            setExpenseSum(prev => prev - originalExpense.amount)

        } catch(error: any){
            setError(error.response?.data?.error || error.message || 'Failed to delete expense');
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    return {
        expenses, expenseSum, isLoading, error, addExpense, editExpense, removeExpense, fetchExpenses
    }
}
// useDashboard.tsx - Custom hook that fetches aggregate totals for the Dashboard.
// Both API calls are made in parallel with Promise.all for better performance.
// currentRemaining is derived as income - expenses after each fetch.
import { useState, useEffect } from "react";
import { getIncomeTotal, getExpenseTotal } from "../api/dashboard";
import { useDateContext } from "../../../context/DateContext";
import { useExpenseContext } from "../../../context/ExpenseContext";

export const useDashboard = () => {
    const { currentMonth } = useDateContext();
    const { expenses } = useExpenseContext();    
    const [ incomeTotal, setIncomeTotal ] = useState(0);
    const [ expenseTotal, setExpenseTotal ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ refresh, setRefresh ] = useState(0);

    const triggerRefresh = () => {
        setRefresh(prev => prev + 1);
    }

    useEffect(() => {
        const fetchTotals = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const [expenseResponse, incomeResponse] = await Promise.all([
                    getExpenseTotal(currentMonth),
                    getIncomeTotal(currentMonth)
                ]);
                const expenses = expenseResponse.data.expenseSum;
                const income = incomeResponse.data.incomeSum;
                setExpenseTotal(expenses);
                setIncomeTotal(income);
            } catch(error: any){
                setError(error.message || 'Failed to fetch totals for the month')
            } finally{
                setIsLoading(false);
            }
        }
        fetchTotals();
    }, [currentMonth, refresh]);

    useEffect(() => {
        const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setExpenseTotal(total);
    }, [expenses]);

    const currentRemaining = incomeTotal - expenseTotal;

    return {
        incomeTotal, expenseTotal, currentRemaining, isLoading, error, triggerRefresh
    }
}
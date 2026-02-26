import { useState, useEffect } from "react";
import { getIncomeTotal, getExpenseTotal } from "../api/dashboard";
import { useDateContext } from "../../../context/DateContext";

export const useDashboard = () => {
    const { currentMonth, setCurrentMonth } = useDateContext();
    const [ incomeTotal, setIncomeTotal ] = useState(0);
    const [ expenseTotal, setExpenseTotal ] = useState(0);
    const [ currentRemaining, setCurrentRemaining ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

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
                setCurrentRemaining(income - expenses);
            } catch(error: any){
                setError(error.message || 'Failed to fetch totlas for the month')
            } finally{
                setIsLoading(false);
            }
        }
        fetchTotals();
    }, [currentMonth]);

    return {
        incomeTotal, expenseTotal, currentRemaining, isLoading, error
    }
}
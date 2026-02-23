import { useExpenseContext } from "../context/ExpenseContext";
import { ExpenseCategoryGroup } from "../features/expenses/components/ExpenseCategorieGroup";
import type { Expense } from "../types";
import { logout } from "../features/auth/api/auth";
import { useNavigate } from "react-router-dom";

export const ExpensesPage = () => {
    const navigate = useNavigate();
    const { expenses, isLoading, error } = useExpenseContext();
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;



    const groupedExpenses: { categoryId: number; categoryName: string; expenses: Expense[] }[] = [];
    
    expenses.forEach(expense => {
        const existingGroup = groupedExpenses.find(g => g.categoryId === expense.categoryId);

        if (existingGroup){
            existingGroup.expenses.push(expense);
        } else{
            groupedExpenses.push({
                categoryId: expense.categoryId,
                categoryName: expense.categoryName,
                expenses: [expense]
            });
        }
    });

    const onLogout = () => {
        logout();
        navigate('/login');
    }


    return (
        <div className="p-6">
            <button onClick={onLogout}>
                Logout
            </button>
            <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Expenses</h1>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                + Add Expense
            </button>
            </div>
            
            {groupedExpenses.map(group => (
                <ExpenseCategoryGroup key={group.categoryId} categoryName={group.categoryName} expenses={group.expenses}/>
            ))}
        </div>
    )
}
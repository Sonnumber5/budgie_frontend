import { useExpenseContext } from "../context/ExpenseContext";
import { ExpenseCategoryGroup } from "../features/expenses/components/ExpenseCategorieGroup";
import type { Expense } from "../types";
import { logout } from "../features/auth/api/auth";
import { useNavigate } from "react-router-dom";

export const ExpensesPage = () => {
    const navigate = useNavigate();
    const { expenses, isLoading, error } = useExpenseContext();
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
        <div>
            <button onClick={onLogout}>
                Logout
            </button>
            <div>
                <h1>Expenses</h1>
                <button>
                    + Add Expense
                </button>
            </div>
            
            {groupedExpenses.map(group => (
                <ExpenseCategoryGroup key={group.categoryId} categoryName={group.categoryName} expenses={group.expenses}/>
            ))}
        </div>
    )
}
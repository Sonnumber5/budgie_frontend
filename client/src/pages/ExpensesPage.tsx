import './ExpensesPage.css';
import { useExpenseContext } from "../context/ExpenseContext";
import { useBudgetContext } from "../context/BudgetContext";
import { CategorizedExpenses } from "../features/expenses/components/CategorizedExpenses";
import { useState } from 'react';
import { Modal } from '../components/modal';
import { ExpenseForm } from '../features/expenses/components/ExpenseForm';


export const ExpensesPage = () => {
    const { expenses, isLoading, error } = useExpenseContext();
    const { categoryBudgets } = useBudgetContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const categorizedExpenses = categoryBudgets.map(categoryBudget => {
        const categoryExpenses = expenses.filter(expense => 
            expense.categoryId === categoryBudget.categoryId
        );

        const totalSpent = categoryExpenses.reduce(
            (sum, expense) => sum + Number(expense.amount), 0
        );

        return {
            categoryBudget,
            expenses: categoryExpenses,
            totalSpent,
            remaining: categoryBudget.budgetedAmount - totalSpent
        }
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return(
        <div className="expense-page">
            <div className="expense-aggregates">
                Total: ${totalExpenses.toFixed(2)}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Add Expense">
                <ExpenseForm onSuccess={() => {setIsModalOpen(false)}}/>
            </Modal>
            <button onClick={() => {setIsModalOpen(true)}}>
                +
            </button>
            <div className="category-list">
                {categorizedExpenses.map((expenseGroup) => {
                    return (
                        <CategorizedExpenses 
                            key={expenseGroup.categoryBudget.id}
                            categoryBudget={expenseGroup.categoryBudget} 
                            expenses={expenseGroup.expenses}
                            totalSpent={expenseGroup.totalSpent}
                            remaining={expenseGroup.remaining}
                        />
                    )
                })}
            </div>
        </div>
    )
}
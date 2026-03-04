// CategoryBudgetOverview.tsx - Displays a single category budget entry as a card.
// Shows the category name, amount spent vs budgeted, and remaining budget.
// Provides edit and delete actions for the category budget.
import { useState } from "react";
import { Modal } from "../../../components/modal";
import { useExpenseContext } from "../../../context/ExpenseContext";
import type { CategoryBudget } from "../../../types";
import './CategoryBudgetOverview.css';
import { useBudgetContext } from "../../../context/BudgetContext";
import { CategoryBudgetForm } from "./CategoryBudgetForm";

interface CategoryBudgetOverviewProps {
    categoryBudget: CategoryBudget,
}

export const CategoryBudgetOverview = ({ categoryBudget }: CategoryBudgetOverviewProps) => {
    const { removeCategoryBudget } = useBudgetContext();
    const { expenses } = useExpenseContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categoryExpenses = expenses.filter(e => e.categoryId === categoryBudget.categoryId);

    const amountSpent = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    const budgetedAmount = Number(categoryBudget.budgetedAmount);
    const remaining = budgetedAmount - amountSpent;
    const isOverBudget = remaining < 0;

    const handleDelete = async () => {
        if (window.confirm(`Delete ${categoryBudget.categoryName} budget? This will also delete all expenses in this category for this month.`)) {
            try {
                await removeCategoryBudget(categoryBudget.id);
                
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete category budget');
            }
        }
    };

    return (
        <div className="category-budget-overview">
            <div className="main-info">
                {categoryBudget.categoryName}
            </div>
            <div className="progress-bar">
               
            </div>
            <div className="sub-info">
                <div>${amountSpent.toFixed(2)} / ${budgetedAmount.toFixed(2)}</div>
                <div style={{ color: isOverBudget ? 'red' : 'green' }}>
                    Remaining: ${remaining.toFixed(2)}
                </div>
            </div>
            <div className="actions">
                <button onClick={() => setIsModalOpen(true)}>
                    Edit
                </button>
                <button onClick={handleDelete}>
                    Delete
                </button>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Category Budget">
                <CategoryBudgetForm 
                    onSuccess={() => setIsModalOpen(false)} 
                    categoryBudgetToEdit={categoryBudget}
                />
            </Modal>
        </div>
    )
}
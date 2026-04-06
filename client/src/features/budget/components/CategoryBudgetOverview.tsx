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
import { toast } from "react-toastify";
import { useDateContext } from "../../../context/DateContext";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { formatCurrency } from "../../../utils/formatCurrency";

interface CategoryBudgetOverviewProps {
    categoryBudget: CategoryBudget,
}

export const CategoryBudgetOverview = ({ categoryBudget }: CategoryBudgetOverviewProps) => {
    const { removeCategoryBudget } = useBudgetContext();
    const { expenses, isLoading: isExpensesLoading } = useExpenseContext();
    const { currentMonth } = useDateContext();
    const [ isCategoryBudgetModalOpen, setIsCategoryBudgetModalOpen ] = useState(false);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);

    const categoryExpenses = expenses.filter(e => e.categoryId === categoryBudget.categoryId);

    const amountSpent = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    const budgetedAmount = Number(categoryBudget.budgetedAmount);
    const remaining = budgetedAmount - amountSpent;
    const isOverBudget = remaining < 0;

    const progress = Math.min((amountSpent / budgetedAmount) * 100, 100);

    const handleDelete = async () => {
        try {
            await removeCategoryBudget(categoryBudget.id);
            toast.success(`Successfully deleted category from ${currentMonth}`);
        } catch (err: any) {
            toast.error(err.response?.data?.error || `Failed to delete category from ${currentMonth}`);

        }
    };

    return (
        <div className="category-budget-overview-with-menu">
            <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => {handleDelete()}}/>
            <Modal isOpen={isCategoryBudgetModalOpen} onClose={() => setIsCategoryBudgetModalOpen(false)} title="Edit Category Budget">
                <CategoryBudgetForm 
                    onSuccess={() => setIsCategoryBudgetModalOpen(false)} 
                    categoryBudgetToEdit={categoryBudget}
                />
            </Modal>
            <div className="category-budget-overview">
                <div className="category-budget-info">
                    <p>{categoryBudget.categoryName}</p>
                    {isExpensesLoading ? 'Loading...' :
                        <p>
                            <span className="text-white">{formatCurrency(Number(amountSpent))}</span>
                            <span> / {formatCurrency(Number(budgetedAmount))}</span>
                        </p>
                    }
                </div>
                <div className="progress-bar">
                    <div className="progress-fill category-budget-preview" style={{ width: isExpensesLoading ? '0%' : `${progress}%`, backgroundColor: isOverBudget ? '#BD6261' : '#FFE13C' }}/>
                </div>
                <p>{isExpensesLoading ? 'Loading...' : `Remaining: ${formatCurrency(Number(remaining))}`}</p>

            </div>
            <div>
                <DropdownMenu onDelete={() => {setIsConfirmModalOpen(true)}} onEdit={() => {setIsCategoryBudgetModalOpen(true)}}/>
            </div>
        </div>
    )
}
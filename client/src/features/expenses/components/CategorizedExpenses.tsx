// CategorizedExpenses.tsx - Collapsible section grouping expenses under a budget category.
// When categoryBudget is undefined the group is treated as "Uncategorized".
// remaining is only shown when a categoryBudget exists (uncategorized has no budget limit).
// The "+" button opens a modal to add a new expense directly into this category.
import type { CategoryBudget, Expense } from "../../../types";
import { ExpenseItem } from "./ExpenseItem";
import './CategorizedExpenses.css';
import { useEffect, useState } from "react";
import { Modal } from "../../../components/modal";
import { ExpenseForm } from "./ExpenseForm";
import { CategoryBudgetForm } from "../../budget/components/CategoryBudgetForm";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useBudgetContext } from "../../../context/BudgetContext";
import { formatCurrency } from "../../../utils/formatCurrency";

interface CategorizedExpensesProps {
    categoryBudget?: CategoryBudget;
    expenses: Expense[];
    totalSpent: number;
    remaining?: number;
}

export const CategorizedExpenses = ({ categoryBudget, expenses, totalSpent, remaining }: CategorizedExpensesProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isCategoryBudgetModalOpen, setIsCategoryBudgetModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const { removeCategoryBudget } = useBudgetContext();

    const progress = categoryBudget ? Math.min((totalSpent / categoryBudget.budgetedAmount) * 100, 100) : 0;

    const isOverBudget = categoryBudget ? totalSpent > categoryBudget.budgetedAmount : false;

    return (
        <div className={`dropdown ${isOpen ? 'open' : ''}`}>
            <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title={'Add Expense'}>
                <ExpenseForm categoryId={categoryBudget?.categoryId} onSuccess={() => setIsExpenseModalOpen(false)} />
            </Modal>
            <Modal isOpen={isCategoryBudgetModalOpen} onClose={() => setIsCategoryBudgetModalOpen(false)} title={'Edit Category Budget'}>
                <CategoryBudgetForm categoryBudgetToEdit={categoryBudget} onSuccess={() => setIsCategoryBudgetModalOpen(false)} />
            </Modal>
            {categoryBudget &&
                <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} confirmAction={() => removeCategoryBudget(categoryBudget.id)} />
            }
            <div className="dropdown-header dropdown-header-gap">
                <div className="category-info-progress-bar">
                    <div className="category-info">
                        <p>{categoryBudget ? categoryBudget.categoryName : "Uncategorized"}</p>
                        <p>
                            <span className="text-white">{categoryBudget ? `${formatCurrency(Number(totalSpent))}` : `Spent: ${formatCurrency(Number(totalSpent))}`}</span>
                            <span>{categoryBudget ? ` / ${formatCurrency(Number(categoryBudget.budgetedAmount))}` : ''}</span>
                        </p>
                    </div>
                    {categoryBudget &&
                        <div className="progress-bar">
                            <div className="progress-fill category-budget-progress-bar" style={{ width: `${progress}%`, backgroundColor: isOverBudget ? '#BD6261' : '#FFE13C' }}></div>
                        </div>
                    }
                </div>
                <div className="category-btns">
                    <button className="btn-add" onClick={() => setIsExpenseModalOpen(true)}>+</button>
                    {categoryBudget &&
                        <DropdownMenu onEdit={() => setIsCategoryBudgetModalOpen(true)} onDelete={() => setIsConfirmModalOpen(true)} />
                    }
                </div>
            </div>
            <div className="expense-list">
                <div className="dropdown-content custom-scroll-bar">
                    {expenses.length < 1 &&
                        <p>No expenses have been added to this category</p>
                    }
                    {expenses.map((expense) => (
                        <ExpenseItem key={expense.id} expense={expense} />
                    ))}
                </div>
            </div>
            <button className="dropdown-toggle" onClick={() => setIsOpen(prev => !prev)}>
                <span className={`dropdown-toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
            </button>
        </div>
    );
}
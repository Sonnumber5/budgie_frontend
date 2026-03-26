// CategorizedExpenses.tsx - Collapsible section grouping expenses under a budget category.
// When categoryBudget is undefined the group is treated as "Uncategorized".
// remaining is only shown when a categoryBudget exists (uncategorized has no budget limit).
// The "+" button opens a modal to add a new expense directly into this category.
import type { CategoryBudget, Expense } from "../../../types";
import { ExpenseItem } from "./ExpenseItem";
import './CategorizedExpenses.css';
import { useState } from "react";
import { Modal } from "../../../components/modal";
import { ExpenseForm } from "./ExpenseForm";
import { CategoryBudgetForm } from "../../budget/components/CategoryBudgetForm";

interface CategorizedExpensesProps{
    categoryBudget?: CategoryBudget;
    expenses: Expense[];
    totalSpent: number;
    remaining?: number;
}

export const CategorizedExpenses = ({ categoryBudget, expenses, totalSpent, remaining }:CategorizedExpensesProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isExpenseModalOpen, setIsExpenseModalOpen ] = useState(false);
    const [ isCategoryBudgetModalOpen, setIsCategoryBudgetModalOpen ] = useState(false);

    return (
        <div className="budget-category">
            <div className="category-info">
                <h3 >{categoryBudget ? categoryBudget.categoryName : "Uncategorized"}</h3>
                <p>{categoryBudget ? `Budget: $${Number(categoryBudget.budgetedAmount).toFixed(2)}` : ""}</p>
                <p>Total Spent: ${totalSpent.toFixed(2)}</p>
                <p>{remaining || remaining === 0 ? `Remaining: $${remaining.toFixed(2)}` : ""}</p>
                <button onClick={() => {setIsExpenseModalOpen(true)}} className="add-btn">+</button>
                <button onClick={() => {setIsCategoryBudgetModalOpen(true)}}>Edit</button>
                <Modal isOpen={isExpenseModalOpen} onClose={() => {setIsExpenseModalOpen(false)}} title={'Expense Form'}>
                    <ExpenseForm categoryId={categoryBudget ? categoryBudget.categoryId : undefined} onSuccess={() => {setIsExpenseModalOpen(false)}}/>
                </Modal>
                <Modal isOpen={isCategoryBudgetModalOpen} onClose={() => {setIsCategoryBudgetModalOpen(false)}} title={'Expense Form'}>
                    <CategoryBudgetForm categoryBudgetToEdit={categoryBudget} onSuccess={() => {setIsCategoryBudgetModalOpen(false)}}/>
                </Modal>
            </div>
            {isOpen && (
                <div className="expenses-group">
                    {expenses.map((expense) => (
                        <ExpenseItem key={expense.id} expense={expense}/>
                    ))}
                </div>
            )}
            <button className="dropdown" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{isOpen ? '▲' : '▼'}</span>
            </button>
        </div>
    )
}
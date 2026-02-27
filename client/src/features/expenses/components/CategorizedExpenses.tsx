import type { CategoryBudget, Expense } from "../../../types";
import { ExpenseItem } from "./ExpenseItem";
import './CategorizedExpenses.css';
import { useState } from "react";
import { Modal } from "../../../components/modal";
import { ExpenseForm } from "./ExpenseForm";

interface CategorizedExpensesProps{
    categoryBudget: CategoryBudget;
    expenses: Expense[];
    totalSpent: number;
    remaining: number;
}

export const CategorizedExpenses = ({ categoryBudget, expenses, totalSpent, remaining }:CategorizedExpensesProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    return (
        <div className="budget-category">
            <div className="category-info" onClick={() => {setIsOpen(!isOpen)}}>
                <h3 >{categoryBudget.categoryName}</h3>
                <p>Budget: ${Number(categoryBudget.budgetedAmount).toFixed(2)}</p>
                <p>Total Spent: ${totalSpent.toFixed(2)}</p>
                <p>Remaining: ${remaining.toFixed(2)}</p>
                <button onClick={() => {setIsModalOpen(true)}} className="add-btn">+</button>
                <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title={'Expense Form'}>
                    <ExpenseForm categoryId={categoryBudget.categoryId} onSuccess={() => {setIsModalOpen(false)}}/>
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
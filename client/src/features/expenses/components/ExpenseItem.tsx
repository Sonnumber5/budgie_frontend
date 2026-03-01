import { useState } from "react";
import { useExpenseContext } from "../../../context/ExpenseContext";
import type { Expense } from "../../../types";
import './ExpenseItem.css';
import { Modal } from "../../../components/modal";
import { ExpenseForm } from "./ExpenseForm";

interface ExpenseItemProps{
    expense: Expense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    const { removeExpense } = useExpenseContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    
    return (
        <div className="expense-item">
            <div>{expense.vendor}</div>
            <div>{expense.description}</div>
            <div>${Number(expense.amount).toFixed(2)}</div>
            <div>{new Date(expense.expenseDate).toLocaleDateString()}</div>
            <div>
                <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Edit Expense">
                    <ExpenseForm onSuccess={() => {setIsModalOpen(false)}} expenseToEdit={expense}/>
                </Modal>
                <button onClick={() => {setIsModalOpen(true)}}>
                    Edit
                </button>
                <button onClick={() => removeExpense(expense.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
};
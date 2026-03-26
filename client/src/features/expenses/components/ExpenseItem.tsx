// ExpenseItem.tsx - Displays a single expense row with Edit and Delete actions.
// The edit form is shown inside a Modal to keep the user on the same page.
import { useState } from "react";
import { useExpenseContext } from "../../../context/ExpenseContext";
import type { Expense } from "../../../types";
import './ExpenseItem.css';
import { Modal } from "../../../components/modal";
import { ExpenseForm } from "./ExpenseForm";
import { toast } from 'react-toastify';
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ConfirmModal } from "../../../components/ConfirmModal";

interface ExpenseItemProps{
    expense: Expense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    const { removeExpense } = useExpenseContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);

    const handleRemoveExpense = async (id: number) => {
        try{
            await removeExpense(id);
            toast.success('Successfully deleted expense');
        } catch(err: any){
            toast.error(err.response?.data?.error || `Failed to delete expense`);
        }
    }
    
    return (
        <div className="expense-item">
            <div>{expense.vendor}</div>
            <div>{expense.description}</div>
            <div>${Number(expense.amount).toFixed(2)}</div>
            <div>{new Date(expense.expenseDate).toLocaleDateString()}</div>
            <div>
                <DropdownMenu onEdit={() => {setIsModalOpen(true)}} onDelete={() => setIsConfirmModalOpen(true)}/>
                <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Edit Expense">
                    <ExpenseForm onSuccess={() => {setIsModalOpen(false)}} expenseToEdit={expense}/>
                </Modal>
                <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => {handleRemoveExpense(expense.id)}}/>
            </div>
        </div>
    );
};
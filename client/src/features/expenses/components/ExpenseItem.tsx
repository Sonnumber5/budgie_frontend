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
import { formatCurrency } from "../../../utils/formatCurrency";

interface ExpenseItemProps {
    expense: Expense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    const { removeExpense } = useExpenseContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    const handleRemoveExpense = async (id: number) => {
        try {
            await removeExpense(id);
            toast.success('Successfully deleted expense');
        } catch (err: any) {
            toast.error(err.response?.data?.error || `Failed to delete expense`);
        }
    }

    return (
        <div>
            <div className="expense-item">
                <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} title="Edit Expense">
                    <ExpenseForm onSuccess={() => { setIsModalOpen(false) }} expenseToEdit={expense} />
                </Modal>
                <Modal isOpen={isDescriptionModalOpen} onClose={() => { setIsDescriptionModalOpen(false) }} title="Expense Notes:">
                    <div className="standard-container">
                        <p>{expense.description}</p>
                    </div>
                </Modal>
                <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => { setIsConfirmModalOpen(false) }} confirmAction={() => { handleRemoveExpense(expense.id) }} />
                <div className="expense-date-vendor">
                    <p>{new Date(expense.expenseDate).toLocaleDateString()}</p>
                    <p>|</p>
                    <p>{expense.vendor}</p>
                </div>
                <div className="expense-amount-settings">
                    <p>{formatCurrency(Number(expense.amount))}</p>
                    <DropdownMenu onEdit={() => { setIsModalOpen(true) }} onDelete={() => setIsConfirmModalOpen(true)} onViewDescription={() => { setIsDescriptionModalOpen(true) }} />
                </div>
            </div>
            <div className="basic-divider"></div>
        </div>
    );
};
// IncomeItem.tsx - Displays a single income row with Edit and Delete actions.
// The edit form opens in a Modal; the date is formatted using the shared formatDate utility.
import type { Income } from "../../../types"
import { useIncomeContext } from "../../../context/IncomeContext";
import './IncomeItem.css';
import { formatDate } from "../../../utils";
import { Modal } from "../../../components/modal";
import { IncomeForm } from "./IncomeForm";
import { useState } from "react";
import { toast } from "react-toastify";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ConfirmModal } from "../../../components/ConfirmModal";


interface IncomeProps {
    income: Income;
}

export const IncomeItem = ({ income }: IncomeProps) => {
    const { removeIncome } = useIncomeContext();
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


    const handleRemoveIncome = async (id: number) => {
        try {
            await removeIncome(id);
            toast.success('Successfully deleted income entry');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to delete income entry');
        }
    }

    return (
        <div>
            <div className="income-item">
                <Modal isOpen={isIncomeModalOpen} onClose={() => { setIsIncomeModalOpen(false) }} title="Edit Income">
                    <IncomeForm incomeToEdit={income} onSuccess={() => { setIsIncomeModalOpen(false) }} />
                </Modal>
                <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => { setIsConfirmModalOpen(false) }} confirmAction={() => { handleRemoveIncome(income.id) }} />
                <div className="income-date-source">
                    <p>{formatDate(income.incomeDate)}</p>
                    <p>|</p>
                    <p>{income.source}</p>
                </div>
                <div className="income-amount-settings">
                    <p>{income.amount}</p>
                    <div>
                        <DropdownMenu onDelete={() => { setIsConfirmModalOpen(true) }} onEdit={() => { setIsIncomeModalOpen(true) }} />
                    </div>
                </div>
            </div>
            <div className="basic-divider"></div>
        </div>
    )
}
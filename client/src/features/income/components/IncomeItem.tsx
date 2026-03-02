// IncomeItem.tsx - Displays a single income row with Edit and Delete actions.
// The edit form opens in a Modal; the date is formatted using the shared formatDate utility.
import type { Income } from "../../../types"
import { useIncomeContext } from "../../../context/IncomeContext";
import './IncomeItem.css';
import { formatDate } from "../../../utils";
import { Modal } from "../../../components/modal";
import { IncomeForm } from "./IncomeForm";
import { useState } from "react";


interface IncomeProps{
    income: Income;
}

export const IncomeItem = ({ income }: IncomeProps) => {
    const { removeIncome } = useIncomeContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    return (
        <div className="income-item">
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Edit Income">
                <IncomeForm incomeToEdit={income} onSuccess={() => {setIsModalOpen(false)}}/>
            </Modal>
            <div>{formatDate(income.incomeDate)}</div>
            <div>{income.source}</div>
            <div>{income.amount}</div>
            <div>
                <button onClick={() => {setIsModalOpen(true)}}>
                    Edit
                </button>
                <button onClick={() => removeIncome(income.id)}>
                    Delete
                </button>
            </div>
        </div>
    )
}
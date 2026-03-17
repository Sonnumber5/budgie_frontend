// IncomeItem.tsx - Displays a single income row with Edit and Delete actions.
// The edit form opens in a Modal; the date is formatted using the shared formatDate utility.
import type { AccountBalance, Income } from "../../../types"
import { useIncomeContext } from "../../../context/IncomeContext";
import './IncomeItem.css';
import { formatDate } from "../../../utils";
import { Modal } from "../../../components/modal";
import { AccountBalanceForm } from "./AccountBalanceForm";
import { useState } from "react";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";


interface AccountBalanceItemProps{
    accountBalance: AccountBalance;
}

export const IncomeItem = ({ accountBalance }: AccountBalanceItemProps) => {
    const { removeAccountBalance } = useAccountBalanceContext()
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    return (
        <div className="income-item">
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Edit Account Balance">
                <AccountBalanceForm accountBalanceToUpdate={accountBalance} onSuccess={() => {setIsModalOpen(false)}}/>
            </Modal>
            <div>{accountBalance.accountName}</div>
            <div style={{ color: accountBalance.accountType === 'Asset' ? 'green' : 'red' }}>{accountBalance.balance}</div>
            <div>
                <button onClick={() => {setIsModalOpen(true)}}>
                    Edit
                </button>
                <button onClick={() => removeAccountBalance(accountBalance.id)}>
                    Delete
                </button>
            </div>
        </div>
    )
}
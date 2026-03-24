
import type { AccountBalance, Income } from "../../../types"
import './AccountBalanceItem.css';
import { Modal } from "../../../components/modal";
import { AccountBalanceForm } from "./AccountBalanceForm";
import { useState } from "react";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";
import { toast } from 'react-toastify';

interface AccountBalanceItemProps{
    accountBalance: AccountBalance;
}

export const AccountBalanceItem = ({ accountBalance }: AccountBalanceItemProps) => {
    const { removeAccountBalance } = useAccountBalanceContext()
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const handleRemoveAccountBalance = async (id: number) => {
        try{
            await removeAccountBalance(id);
            toast.success('Successfully deleted account balance');
        } catch(err: any){
            toast.error(err.response?.data?.error || `Failed to delete account balance`);
        }
    }

    return (
        <div className="income-item">
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Edit Account Balance">
                <AccountBalanceForm accountBalanceToUpdate={accountBalance} onSuccess={() => {setIsModalOpen(false)}}/>
            </Modal>
            <div>{accountBalance.accountName}</div>
            <div style={{ color: accountBalance.accountType === 'Asset' ? 'green' : 'red' }}>${Number(accountBalance.balance).toFixed(2)}</div>
            <div>
                <button onClick={() => {setIsModalOpen(true)}}>
                    Edit
                </button>
                <button onClick={() => handleRemoveAccountBalance(accountBalance.id)}>
                    Delete
                </button>
            </div>
        </div>
    )
}
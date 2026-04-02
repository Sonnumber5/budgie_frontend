
import type { AccountBalance } from "../../../types"
import './AccountBalanceItem.css';
import { Modal } from "../../../components/modal";
import { AccountBalanceForm } from "./AccountBalanceForm";
import { useState } from "react";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";
import { toast } from 'react-toastify';
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ConfirmModal } from "../../../components/ConfirmModal";

interface AccountBalanceItemProps{
    accountBalance: AccountBalance;
}

export const AccountBalanceItem = ({ accountBalance }: AccountBalanceItemProps) => {
    const { removeAccountBalance } = useAccountBalanceContext()
    const [ isAccountBalanceModalOpen, setIsAccountBalanceModalOpen ] = useState(false);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);

    const handleRemoveAccountBalance = async () => {
        try{
            await removeAccountBalance(accountBalance.id);
            toast.success('Successfully deleted account balance');
        } catch(err: any){
            toast.error(err.response?.data?.error || `Failed to delete account balance`);
        }
    }

    return (
        <div>
            <div className="account-balance-item">
                <Modal isOpen={isAccountBalanceModalOpen} onClose={() => {setIsAccountBalanceModalOpen(false)}} title="Edit Account Balance">
                    <AccountBalanceForm accountBalanceToUpdate={accountBalance} onSuccess={() => {setIsAccountBalanceModalOpen(false)}}/>
                </Modal>
                <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => {handleRemoveAccountBalance()}}/>
                <div>{accountBalance.accountName}</div>
                
                <div className="account-balance-manage">
                    <div style={{ color: accountBalance.accountType === 'Asset' ? 'var(--color-green-primary)' : 'var(--color-red-primary)' }}>${Number(accountBalance.balance).toFixed(2)}</div>
                    <div>
                        <DropdownMenu onEdit={() => {setIsAccountBalanceModalOpen(true)}} onDelete={() => {setIsConfirmModalOpen(true)}}/>
                    </div>
                </div>
            </div>
            <div className="basic-divider"></div>
        </div>
    )
}
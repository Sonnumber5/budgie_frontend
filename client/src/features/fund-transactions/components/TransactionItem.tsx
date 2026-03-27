
import { useState } from "react";
import type { FundTransaction } from "../../../types";
import { Modal } from "../../../components/modal";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import { FundTransactionForm } from "./FundTransactionForm";
import './TransactionItem.css';
import { toast } from "react-toastify";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ConfirmModal } from "../../../components/ConfirmModal";

interface TransactionItemProps{
    transaction: FundTransaction;
    canDelete: boolean;
}

export const TransactionItem = ({ transaction, canDelete }: TransactionItemProps) => {
    const { removeFundTransaction } = useFundTransactionContext();
    const [ isTransactionModalOpen, setIsTransactionModalOpen ] = useState(false);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);

    const handleRemoveTransaction = async (savingsFundId: number, transactionId: number) => {
        try{
            await removeFundTransaction(savingsFundId, transactionId);
            toast.success('Successfully deleted transaction');
        } catch(err: any){
            toast.error(err.response?.data?.error || 'Failed to delete transaction')
        }
    }
    
    return (
        <div className="transaction-item">
            <Modal isOpen={isTransactionModalOpen} onClose={() => {setIsTransactionModalOpen(false)}} title="Edit Transaction">
                <FundTransactionForm onSuccess={() => {setIsTransactionModalOpen(false)}} transactionToEdit={transaction} fundId={transaction.savingsFundId}/>
            </Modal>
            <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => {handleRemoveTransaction(transaction.savingsFundId, transaction.id)}}/>
            <div>{transaction.description}</div>
            <div>${Number(transaction.amount).toFixed(2)}</div>
            <div>{new Date(transaction.transactionDate).toLocaleDateString()}</div>
            <div>{transaction.transactionType}</div>
            {canDelete &&
                <div>
                    <DropdownMenu onEdit={() => {setIsTransactionModalOpen(true)}} onDelete={() => {setIsConfirmModalOpen(true)}}/>
                </div>
            }
        </div>
    );
};
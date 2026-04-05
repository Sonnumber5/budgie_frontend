
import { useState } from "react";
import type { FundTransaction } from "../../../types";
import { Modal } from "../../../components/modal";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import { FundTransactionForm } from "./FundTransactionForm";
import './TransactionItem.css';
import { toast } from "react-toastify";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ConfirmModal } from "../../../components/ConfirmModal";

interface TransactionItemProps {
    transaction: FundTransaction;
    canDelete: boolean;
}

export const TransactionItem = ({ transaction, canDelete }: TransactionItemProps) => {
    const { removeFundTransaction } = useFundTransactionContext();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const formattedType = (transaction.transactionType.replace(/_/g, ' ').charAt(0).toUpperCase() + transaction.transactionType.replace(/_/g, ' ').slice(1).toLowerCase());

    const handleRemoveTransaction = async (savingsFundId: number, transactionId: number) => {
        try {
            await removeFundTransaction(savingsFundId, transactionId);
            toast.success('Successfully deleted transaction');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to delete transaction')
        }
    }

    return (
        <div className="transaction-item">
            <Modal isOpen={isTransactionModalOpen} onClose={() => { setIsTransactionModalOpen(false) }} title="Edit Transaction">
                <FundTransactionForm onSuccess={() => { setIsTransactionModalOpen(false) }} transactionToEdit={transaction} fundId={transaction.savingsFundId} />
            </Modal>
            <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => { setIsConfirmModalOpen(false) }} confirmAction={() => { handleRemoveTransaction(transaction.savingsFundId, transaction.id) }} />
            {canDelete &&
                <div className="transaction-content">
                    <div className="transaction-type-date-desc enabled">
                        <p>{formattedType}</p>
                        <p>|</p>
                        <p>{new Date(transaction.transactionDate).toLocaleDateString()}</p>
                        <p>|</p>
                        <p>{transaction.description}</p>
                    </div>
                    <div className="transaction-amount-settings enabled">
                        <p style={{color:transaction.transactionType === 'contribution' ? '#68BE7A' : '#BD6261'}}>${Number(transaction.amount).toFixed(2)}</p>
                        <DropdownMenu onEdit={() => { setIsTransactionModalOpen(true) }} onDelete={() => { setIsConfirmModalOpen(true) }} />
                    </div>
                </div>
            }
            {!canDelete &&
                <div className="transaction-content">
                    <div className="transaction-type-date-desc disabled">
                        <p>{formattedType}</p>
                        <p>|</p>
                        <p>{new Date(transaction.transactionDate).toLocaleDateString()}</p>
                        <p>|</p>
                        <p>{transaction.description}</p>
                        
                    </div>
                    <div className="transaction-amount-settings disabled">
                        {transaction.transactionType === 'transfer_in' &&
                        <p style={{color: '#68BE7A'}}>${Number(transaction.amount).toFixed(2)}</p>
                        }
                        {transaction.transactionType === 'transfer_out' &&
                        <p style={{color: '#BD6261'}}>${Number(transaction.amount).toFixed(2)}</p>
                        }
                        {transaction.transactionType === 'adjustment' &&
                        <p style={{color: '#8893A6'}}>${Number(transaction.amount).toFixed(2)}</p>
                        }
                        
                        <button className='disabled-kebab' type="button" onClick={() => { }}>⋮</button>
                    </div> 
                </div>
            }
        </div>
    );
};
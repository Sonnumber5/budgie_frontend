
import { useState } from "react";
import type { FundTransaction } from "../../../types";
import { Modal } from "../../../components/Modal";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import { FundTransactionForm } from "./FundTransactionForm";
import './TransactionItem.css';

interface TransactionItemProps{
    transaction: FundTransaction;
    canDelete: boolean;
}

export const TransactionItem = ({ transaction, canDelete }: TransactionItemProps) => {
    const { removeFundTransaction } = useFundTransactionContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    
    return (
        <div className="transaction-item">
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Edit Transaction">
                <FundTransactionForm onSuccess={() => {setIsModalOpen(false)}} transactionToEdit={transaction} fundId={transaction.savingsFundId}/>
            </Modal>
            <div>{transaction.description}</div>
            <div>${Number(transaction.amount).toFixed(2)}</div>
            <div>{new Date(transaction.transactionDate).toLocaleDateString()}</div>
            <div>{transaction.transactionType}</div>
            {canDelete &&
                <div>
                    <button onClick={() => {setIsModalOpen(true)}}>
                        Edit
                    </button>
                    <button onClick={() => removeFundTransaction(transaction.savingsFundId, transaction.id)}>
                        Delete
                    </button> 
                </div>
            }
        </div>
    );
};
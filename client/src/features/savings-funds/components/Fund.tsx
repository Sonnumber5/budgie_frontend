import { useState } from "react";
import { Modal } from "../../../components/modal";
import type { FundTransaction, SavingsFund } from "../../../types";
import './Fund.css';
import { FundForm } from "./FundForm";
import { TransactionItem } from "../../fund-transactions/components/TransactionItem";
import { FundTransactionForm } from "../../fund-transactions/components/FundTransactionForm";
import { AdjustmentTransactionForm } from "../../fund-transactions/components/AdjustmentTransactionForm";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";
import { toast } from "react-toastify";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { formatCurrency } from "../../../utils/formatCurrency";
import React from "react";
interface SavingsFundProps{
    fund: SavingsFund;
    relatedTransactions: FundTransaction[];
    archived?: boolean
}

// Renders a savings fund card with its transactions list, progress bar, and modals for editing, adding transactions, and archiving.
export const Fund = ({ fund, relatedTransactions, archived }: SavingsFundProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isTransactionModalOpen, setIsTransactionModalOpen ] = useState(false);
    const [ isEditFundModalOpen, setIsEditFundModalOpen ] = useState(false);
    const [ isEditBalanceOpen, setIsEditBalanceOpen ] = useState(false);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);
    const { archiveSavingsFund, unarchiveSavingsFund, removeSavingsFund } = useSavingsFundContext();

    // Archives the fund and shows a success or error toast.
    const handleArchive = async () => {
        try {
            await archiveSavingsFund(fund.id);
            toast.success('Successfully archived savings fund');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to archive savings fund');
        }
    };

    // Deletes the fund and shows a success or error toast.
    const handleDelete = async () => {
        try {
            await removeSavingsFund(fund.id);
            toast.success('Successfully deleted savings fund');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to delete savings fund');
        }
    };

    // Archives the fund and shows a success or error toast.
    const handleUnarchive = async () => {
        try {
            await unarchiveSavingsFund(fund.id);
            toast.success('Successfully unarchived savings fund');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to unarchive savings fund');
        }
    };

    const progress = Math.min((fund.balance / fund.goal) * 100, 100);

    return (
        <div className={`dropdown ${isOpen ? 'open' : ''}`}>
                <Modal isOpen={isTransactionModalOpen} onClose={() => {setIsTransactionModalOpen(false)}} title={'Add Transaction'}>
                    <FundTransactionForm onSuccess={() => {setIsTransactionModalOpen(false)}} fundId={fund.id}/>
                </Modal>
                <Modal isOpen={isEditFundModalOpen} onClose={() => {setIsEditFundModalOpen(false)}} title={'Edit Fund'}>
                    <FundForm onSuccess={() => {setIsEditFundModalOpen(false)}} fundToEdit={fund}/>
                </Modal>
                <Modal isOpen={isEditBalanceOpen} onClose={() => {setIsEditBalanceOpen(false)}} title={'Adjust Balance'}>
                    <AdjustmentTransactionForm onSuccess={() => {setIsEditBalanceOpen(false)}} fund={fund}/>
                </Modal>
            <div className="fund-info dropdown-header">
                <div className="fund-progress-bar-details">
                    <div className="fund-details">
                        <p>{fund.name}</p>
                        <p>
                            <span>{formatCurrency(Number(fund.balance))}</span>
                            <span className="text-fraction"> / {formatCurrency(Number(fund.goal))}</span>
                        </p>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill fund-preview" style={{width: `${progress}%`}}></div>
                    </div>
                </div>
                <div className="fund-btns">
                    {!archived &&
                        <>
                            <button className="btn-add" onClick={() => {setIsTransactionModalOpen(true)}}>+</button>
                            <DropdownMenu onEditBalance={() => {setIsEditBalanceOpen(true)}} onEdit={() => {setIsEditFundModalOpen(true)}} onArchive={() => {setIsConfirmModalOpen(true)}}/>
                            <ConfirmModal isOpen={isConfirmModalOpen} confirmAction={handleArchive} onClose={() => {setIsConfirmModalOpen(false)}}/>
                        </>
                    }
                    {archived &&
                        <>
                            <DropdownMenu onUnArchive={() => {handleUnarchive()}} onDelete={() => {setIsConfirmModalOpen(true)}}/>
                            <ConfirmModal isOpen={isConfirmModalOpen} confirmAction={handleDelete} onClose={() => {setIsConfirmModalOpen(false)}}/>
                        </>
                    }
                </div>
            </div>
            <div className="dropdown-content">
                {relatedTransactions.length < 1 &&
                    <p>There are no transactions for this month.</p>
                }
                {relatedTransactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>                        
                        <TransactionItem transaction={transaction} canDelete={transaction.transactionType !== 'adjustment' && transaction.transactionType !== 'transfer_in' && transaction.transactionType !== 'transfer_out'}/>
                        <div className="basic-divider"></div>
                    </React.Fragment>
                ))}
            </div>
            <button className="dropdown-toggle" onClick={() => {setIsOpen(prev => !prev)}}>
                <span className={`dropdown-toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

        </div>
    )
}
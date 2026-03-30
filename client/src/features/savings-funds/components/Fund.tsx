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
interface SavingsFundProps{
    fund: SavingsFund;
    relatedTransactions: FundTransaction[];
}

export const Fund = ({ fund, relatedTransactions }: SavingsFundProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isTransactionModalOpen, setIsTransactionModalOpen ] = useState(false);
    const [ isEditFundModalOpen, setIsEditFundModalOpen ] = useState(false);
    const [ isEditBalanceOpen, setIsEditBalanceOpen ] = useState(false);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);
    const { archiveSavingsFund } = useSavingsFundContext();

    const handleRemove = async () => {
        try {
            await archiveSavingsFund(fund.id);
            toast.success('Successfully archived savings fund');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to archive savings fund');
        }
    };

    return (
        <div className="savings-fund">
                <Modal isOpen={isTransactionModalOpen} onClose={() => {setIsTransactionModalOpen(false)}} title={'Add Transaction'}>
                    <FundTransactionForm onSuccess={() => {setIsTransactionModalOpen(false)}} fundId={fund.id}/>
                </Modal>
                <Modal isOpen={isEditFundModalOpen} onClose={() => {setIsEditFundModalOpen(false)}} title={'Edit Fund'}>
                    <FundForm onSuccess={() => {setIsEditFundModalOpen(false)}} fundToEdit={fund}/>
                </Modal>
                <Modal isOpen={isEditBalanceOpen} onClose={() => {setIsEditBalanceOpen(false)}} title={'Adjust Balance'}>
                    <AdjustmentTransactionForm onSuccess={() => {setIsEditBalanceOpen(false)}} fund={fund}/>
                </Modal>
                <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => {handleRemove()}}/>
            <div className="fund-info">
                <h3 >{fund.name}</h3>
                
                <p>{`Goal: $${Number(fund.goal).toFixed(2)}`}</p>
                <div>
                    <p>{`Balance: $${Number(fund.balance).toFixed(2)}`}</p>
                </div>
                <div className="fund-btns">
                    <button className="btn-add" onClick={() => {setIsTransactionModalOpen(true)}}>+</button>
                    <DropdownMenu onEditBalance={() => {setIsEditBalanceOpen(true)}} onEdit={() => {setIsEditFundModalOpen(true)}} onArchive={() => {setIsConfirmModalOpen(true)}}/>
                </div>
            </div>
            {isOpen && (
                <div className="fund-transactions">
                    {relatedTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} canDelete={transaction.transactionType !== 'adjustment' && transaction.transactionType !== 'transfer_in' && transaction.transactionType !== 'transfer_out'}/>
                    ))}
                </div>
            )}
            <button className="dropdown" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{isOpen ? '▲' : '▼'}</span>
            </button>
        </div>
    )
}
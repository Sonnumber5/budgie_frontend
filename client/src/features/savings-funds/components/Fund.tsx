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
                <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => {handleRemove()}}/>
            <div className="fund-info dropdown-header">
                <div className="fund-progress-bar-details">
                    <div className="fund-details">
                        <p>{fund.name}</p>
                        <p>
                            <span className="text-white">${Number(fund.balance).toFixed(2)}</span>
                            <span> / ${Number(fund.goal).toFixed(2)}</span>
                        </p>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill fund-preview" style={{width: `${progress}%`}}></div>
                    </div>
                </div>
                <div className="fund-btns">
                    <button className="btn-add" onClick={() => {setIsTransactionModalOpen(true)}}>+</button>
                    <DropdownMenu onEditBalance={() => {setIsEditBalanceOpen(true)}} onEdit={() => {setIsEditFundModalOpen(true)}} onArchive={() => {setIsConfirmModalOpen(true)}}/>
                </div>
            </div>
            <div className="dropdown-content">
                {relatedTransactions.map((transaction) => (
                    <>                        
                        <TransactionItem key={transaction.id} transaction={transaction} canDelete={transaction.transactionType !== 'adjustment' && transaction.transactionType !== 'transfer_in' && transaction.transactionType !== 'transfer_out'}/>
                        <div className="basic-divider"></div>

                    </>
                ))}
            </div>
            <button className="dropdown-toggle" onClick={() => {setIsOpen(prev => !prev)}}>
                <span className={`dropdown-toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

        </div>
    )
}
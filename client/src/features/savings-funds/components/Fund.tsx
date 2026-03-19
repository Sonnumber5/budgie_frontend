import { useState } from "react";
import { Modal } from "../../../components/modal";
import type { FundTransaction, SavingsFund } from "../../../types";
import './Fund.css';
import { FundForm } from "./FundForm";
import { TransactionItem } from "../../fund-transactions/components/TransactionItem";
import { FundTransactionForm } from "../../fund-transactions/components/FundTransactionForm";
import { AdjustmentTransactionForm } from "../../fund-transactions/components/AdjustmentTransactionForm";
import { useSavingsFunds } from "../hooks/useSavingsFunds";

interface SavingsFundProps{
    fund: SavingsFund;
    relatedTransactions: FundTransaction[];
}

export const Fund = ({ fund, relatedTransactions }: SavingsFundProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isTransactionModalOpen, setIsTransactionModalOpen ] = useState(false);
    const [ isEditFundModalOpen, setIsEditFundModalOpen ] = useState(false);
    const [ isEditBalanceOpen, setIsEditBalanceOpen ] = useState(false);
    const { removeSavingsFund } = useSavingsFunds();

    const handleDelete = async () => {
        if (window.confirm(`Delete ${fund.name} fund? Any contributions made to this fund will still be displayed on monthly summaries on the dashboard`)) {
            try {
                await removeSavingsFund(fund.id);
            } catch (error) {
                alert('Unable to remove category budget');
            }
        }
    };

    return (
        <div className="savings-fund">
                <Modal isOpen={isTransactionModalOpen} onClose={() => {setIsTransactionModalOpen(false)}} title={'Fund transaction form'}>
                    <FundTransactionForm onSuccess={() => {setIsTransactionModalOpen(false)}} fundId={fund.id}/>
                </Modal>
                <Modal isOpen={isEditFundModalOpen} onClose={() => {setIsEditFundModalOpen(false)}} title={'Fund transaction form'}>
                    <FundForm onSuccess={() => {setIsEditFundModalOpen(false)}} fundToEdit={fund}/>
                </Modal>
                <Modal isOpen={isEditBalanceOpen} onClose={() => {setIsEditBalanceOpen(false)}} title={'Adjust balance form'}>
                    <AdjustmentTransactionForm onSuccess={() => {setIsEditBalanceOpen(false)}} fund={fund}/>
                </Modal>
            <div className="fund-info">
                <h3 >{fund.name}</h3>
                
                <p>{`Goal: $${Number(fund.goal).toFixed(2)}`}</p>
                <div>
                    <p>{`Balance: $${Number(fund.balance).toFixed(2)}`}</p>
                    <button onClick={() => {setIsEditBalanceOpen(true)}}>
                        Edit balance
                    </button>
                </div>
                <div className="fund-btns">
                    <button onClick={() => {setIsTransactionModalOpen(true)}} className="add-fund-btn">+</button>
                    <button onClick={() => {setIsEditFundModalOpen(true)}} className="edit-fund-btn">Edit</button>
                    <button onClick={handleDelete} className="delete-fund-btn">Delete</button>
                </div>
            </div>
            {isOpen && (
                <div className="fund-transactions">
                    {relatedTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} canDelete={transaction.transactionType !== 'adjustment'}/>
                    ))}
                </div>
            )}
            <button className="dropdown" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{isOpen ? '▲' : '▼'}</span>
            </button>
        </div>
    )
}
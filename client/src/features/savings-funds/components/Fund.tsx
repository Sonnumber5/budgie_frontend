import { useState } from "react";
import { Modal } from "../../../components/modal";
import type { FundTransaction, SavingsFund } from "../../../types";
import './Fund.css';
import { FundForm } from "./FundForm";
import { TransactionItem } from "../../fund-transactions/components/TransactionItem";
import { FundTransactionForm } from "../../fund-transactions/components/FundTransactionForm";
import { AdjustmentTransactionForm } from "../../fund-transactions/components/AdjustmentTransactionForm";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";
interface SavingsFundProps{
    fund: SavingsFund;
    relatedTransactions: FundTransaction[];
}

export const Fund = ({ fund, relatedTransactions }: SavingsFundProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isTransactionModalOpen, setIsTransactionModalOpen ] = useState(false);
    const [ isEditFundModalOpen, setIsEditFundModalOpen ] = useState(false);
    const [ isEditBalanceOpen, setIsEditBalanceOpen ] = useState(false);
    const { archiveSavingsFund } = useSavingsFundContext();

    const handleRemove = async () => {
        if (window.confirm(`Archive "${fund.name}"?`)) {
            try {
                await archiveSavingsFund(fund.id);
            } catch (error) {
                alert(`Unable to archive "${fund.name}"`);
            }
        }
    };

    return (
        <div className="savings-fund">
                <Modal isOpen={isTransactionModalOpen} onClose={() => {setIsTransactionModalOpen(false)}} title={'Fund transaction form'}>
                    <FundTransactionForm onSuccess={() => {setIsTransactionModalOpen(false)}} fundId={fund.id}/>
                </Modal>
                <Modal isOpen={isEditFundModalOpen} onClose={() => {setIsEditFundModalOpen(false)}} title={'Edit fund'}>
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
                    <button onClick={handleRemove}>Archive</button>
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
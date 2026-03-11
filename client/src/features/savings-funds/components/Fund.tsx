import { useState } from "react";
import { Modal } from "../../../components/modal";
import type { FundTransaction, SavingsFund } from "../../../types";
import './Fund.css';
import { FundForm } from "./FundForm";
import { TransactionItem } from "../../fund-transactions/components/TransactionItem";
import { FundTransactionForm } from "../../fund-transactions/components/FundTransactionForm";

interface SavingsFundProps{
    fund: SavingsFund;
    relatedTransactions: FundTransaction[];
}

export const Fund = ({ fund, relatedTransactions }: SavingsFundProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isTransactionModalOpen, setIsTransactionModalOpen ] = useState(false);
    const [ isEditFundModalOpen, setIsEditFundModalOpen ] = useState(false);

    return (
        <div className="savings-fund">
                <Modal isOpen={isTransactionModalOpen} onClose={() => {setIsTransactionModalOpen(false)}} title={'Fund transaction form'}>
                    <FundTransactionForm onSuccess={() => {setIsTransactionModalOpen(false)}}/>
                </Modal>
                <Modal isOpen={isEditFundModalOpen} onClose={() => {setIsEditFundModalOpen(false)}} title={'Fund transaction form'}>
                    <FundForm onSuccess={() => {setIsEditFundModalOpen(false)}} fundToEdit={fund}/>
                </Modal>
            <div className="fund-info">
                <h3 >{fund.name}</h3>
                <p>{`Goal: $${Number(fund.goal).toFixed(2)}`}</p>
                <p>{`Balance: $${Number(fund.balance).toFixed(2)}`}</p>
                <div className="fund-btns">
                    <button onClick={() => {setIsTransactionModalOpen(true)}} className="add-fund-btn">+</button>
                    <button onClick={() => {setIsEditFundModalOpen(true)}} className="edit-fund-btn">Edit</button>
                </div>
            </div>
            {isOpen && (
                <div className="fund-transactions">
                    {relatedTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction}/>
                    ))}
                </div>
            )}
            <button className="dropdown" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{isOpen ? '▲' : '▼'}</span>
            </button>
        </div>
    )
}
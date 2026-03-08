import { useState } from "react";
import { Modal } from "../../../components/modal";
import type { SavingsFund } from "../../../types";
import './Fund.css';

interface SavingsFundProps{
    fund: SavingsFund;
}

export const Fund = ({ fund }: SavingsFundProps) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    return (
        <div className="savings-fund">
            <div className="fund-info">
                <h3 >{fund.name}</h3>
                <p>{`Goal: $${Number(fund.goal).toFixed(2)}`}</p>
                <p>{`Balance: $${Number(fund.balance).toFixed(2)}`}</p>
                <button onClick={() => {setIsModalOpen(true)}} className="add-btn">+</button>
                <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title={'Fund transaction form'}>
                    Build out fund transaction form
                </Modal>
            </div>
            {isOpen && (
                <div className="fund-transactions">
                    List of fund transactions
                    {/*fundTransactions.map((transaction) => (
                        <FundTransactionItem key={transaction.id} transaction={transaction}/>
                    ))*/}
                </div>
            )}
            <button className="dropdown" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{isOpen ? '▲' : '▼'}</span>
            </button>
        </div>
    )
}
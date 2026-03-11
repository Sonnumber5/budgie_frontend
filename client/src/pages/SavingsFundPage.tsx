import { useSavingsFundContext } from "../context/SavingsFundContext";
import { useState } from "react";
import './SavingsFundPage.css';
import { Fund } from "../features/savings-funds/components/Fund";
import { Modal } from "../components/modal";
import { FundForm } from "../features/savings-funds/components/FundForm";
import { useFundTransactionContext } from "../context/FundTransactionContext";

export const SavingsFundPage = () => {
    const { activeSavingsFunds, isLoading, error } = useSavingsFundContext();
    const { transactions } = useFundTransactionContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    if (isLoading) return <p>Loading...</p>;

    const sortedFundsWithTransactions = activeSavingsFunds.map(savingsFund => {
        const fundTransactions = transactions.filter(transaction => 
            transaction.savingsFundId === savingsFund.id
        )
        return{fundTransactions, savingsFund}
    })

    return(
        <div className="savings-fund-page">
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Savings fund form">
                <FundForm onSuccess={() => {setIsModalOpen(false)}}/>
            </Modal>
            <button onClick={() => {setIsModalOpen(true)}}>
                +
            </button>
            <div className="fund-list">
            {sortedFundsWithTransactions.map((fundWithTransactions) => (
                <Fund key={fundWithTransactions.savingsFund.id} fund={fundWithTransactions.savingsFund} relatedTransactions={fundWithTransactions.fundTransactions}/>
            ))}
            </div>
        </div>
    )
}
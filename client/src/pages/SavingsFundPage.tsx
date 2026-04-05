import { useSavingsFundContext } from "../context/SavingsFundContext";
import { useState } from "react";
import './SavingsFundPage.css';
import { Fund } from "../features/savings-funds/components/Fund";
import { Modal } from "../components/modal";
import { FundForm } from "../features/savings-funds/components/FundForm";
import { useFundTransactionContext } from "../context/FundTransactionContext";
import { TransferFundForm } from "../features/fund-transactions/components/TransferFundForm";

export const SavingsFundPage = () => {
    const { activeSavingsFunds, isLoading, error } = useSavingsFundContext();
    const { transactions } = useFundTransactionContext();
    const [ isAddFundModalOpen, setIsAddFundModalOpen ] = useState(false);
    const [ isTransferModalOpen, setIsTransferModalOpen ] = useState(false);


    const sortedFundsWithTransactions = activeSavingsFunds.map(savingsFund => {
        const fundTransactions = transactions.filter(transaction => 
            transaction.savingsFundId === savingsFund.id
        )
        return{fundTransactions, savingsFund}
    })

    return(
        <div className="page container">
            <Modal isOpen={isAddFundModalOpen} onClose={() => {setIsAddFundModalOpen(false)}} title="Add Savings Fund">
                <FundForm onSuccess={() => {setIsAddFundModalOpen(false)}}/>
            </Modal>
            <Modal isOpen={isTransferModalOpen} onClose={() => {setIsTransferModalOpen(false)}} title="Transfer Funds">
                <TransferFundForm onSuccess={() => {setIsTransferModalOpen(false)}}/>
            </Modal>
            <button className="btn-primary" onClick={() => {setIsTransferModalOpen(true)}}>
                Transfer funds
            </button>
            <button className="btn-add" onClick={() => {setIsAddFundModalOpen(true)}}>
                +
            </button>
            <div className="fund-list">
            {isLoading && <p>Loading...</p>}
            {sortedFundsWithTransactions.map((fundWithTransactions) => (
                <Fund key={fundWithTransactions.savingsFund.id} fund={fundWithTransactions.savingsFund} relatedTransactions={fundWithTransactions.fundTransactions}/>
            ))}
            </div>
        </div>
    )
}
import { useSavingsFundContext } from "../context/SavingsFundContext";
import { useState } from "react";
import './SavingsFundPage.css';
import { Fund } from "../features/savings-funds/components/Fund";
import { Modal } from "../components/modal";
import { FundForm } from "../features/savings-funds/components/FundForm";
import { useFundTransactionContext } from "../context/FundTransactionContext";
import { TransferFundForm } from "../features/fund-transactions/components/TransferFundForm";
import { MonthPicker } from "../components/DatePicker";

// Page that lists all archived savings funds with their transactions, and provides controls to add funds and transfer between them.
export const ArchivedSavingsFundPage = () => {
    const { archivedSavingsFunds, isLoading } = useSavingsFundContext();
    const { transactions } = useFundTransactionContext();
    const [ isAddFundModalOpen, setIsAddFundModalOpen ] = useState(false);
    const [ isTransferModalOpen, setIsTransferModalOpen ] = useState(false);

    const sortedFundsWithTransactions = archivedSavingsFunds.map(savingsFund => {
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
            <MonthPicker/>
            <div className="fund-page-dashboard">
            </div>
            <div className="fund-list">
                {isLoading && <p>Loading...</p>}
                {archivedSavingsFunds.length < 1 && !isLoading &&
                    <p>There are no archived savings funds.</p>
                }
                {sortedFundsWithTransactions.map((fundWithTransactions) => (
                    <Fund key={fundWithTransactions.savingsFund.id} fund={fundWithTransactions.savingsFund} relatedTransactions={fundWithTransactions.fundTransactions} archived={true}/>
                ))}
            </div>
        </div>
    )
}
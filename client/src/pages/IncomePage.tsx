import { IncomeItem } from "../features/income/components/IncomeItem";
import { useIncomeContext } from "../context/IncomeContext";
import './IncomePage.css';
import { Modal } from "../components/modal";
import { useState } from "react";
import { IncomeForm } from "../features/income/components/IncomeForm";


export const IncomePage = () => {
    const { incomeSum, incomeList, isLoading, error } = useIncomeContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    return(
        <div className="income-page">
            <div className="income-aggregates">
            Total: {incomeSum}
            </div>
            <button onClick={() => {setIsModalOpen(true)}}>
            + Add Income
            </button>
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Add Income">
                <IncomeForm onSuccess={() => {setIsModalOpen(false)}}/>
            </Modal>
            <div className="income-list">
                {incomeList.map((income) => (
                    <IncomeItem key={income.id} income={income}/>
                ))}
            </div>
        </div>
    )
}
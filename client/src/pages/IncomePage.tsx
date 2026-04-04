// IncomePage.tsx - Lists all income entries for the current month.
// Displays the running monthly income total from IncomeContext.
// The "Add Income" button opens a modal with the IncomeForm for quick entry.
import { IncomeItem } from "../features/income/components/IncomeItem";
import { useIncomeContext } from "../context/IncomeContext";
import './IncomePage.css';
import { Modal } from "../components/modal";
import { useState } from "react";
import { IncomeForm } from "../features/income/components/IncomeForm";
import { useBudgetContext } from "../context/BudgetContext";


export const IncomePage = () => {
    const { incomeSum, incomeList, isLoading, error } = useIncomeContext();
    const { monthlyBudget } = useBudgetContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page container">
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} title="Add Income">
                <IncomeForm onSuccess={() => { setIsModalOpen(false) }} />
            </Modal>
            <div className="income-page-header">
                {/* income-dashboard-summary style exists in Dashboard.css */}
                <div className="income-dashboard-summary">
                    <p>Income (Actual)</p>
                    <p>{isLoading ? 'Loading...' : `$${Number(incomeSum).toFixed(2)}`}</p>
                    <p>{monthlyBudget ? `Expected: $${monthlyBudget.expectedIncome}` : 'Expected:'}</p>
                </div>
                <button className="btn-add" onClick={() => { setIsModalOpen(true) }}>+</button>
            </div>
            <div className="standard-container income-content">
                <div className="custom-scroll-bar">
                    <div className="income-list">
                        {isLoading && <p>Loading...</p>}
                        {incomeList.map((income) => (
                            <IncomeItem key={income.id} income={income} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
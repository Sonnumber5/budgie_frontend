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
import { formatCurrency } from "../utils/formatCurrency";
import { MonthPicker } from "../components/DatePicker";


export const IncomePage = () => {
    const { incomeSum, incomeList, isLoading } = useIncomeContext();
    const { monthlyBudget } = useBudgetContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page container">
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} title="Add Income">
                <IncomeForm onSuccess={() => { setIsModalOpen(false) }} />
            </Modal>
            <MonthPicker/>
            <div className="income-page-header">
                {/* income-dashboard-summary style exists in Dashboard.css */}
                <div className="income-dashboard-summary">
                    <p>Income (Actual)</p>
                    
                    {isLoading ? 'Loading...' : 
                    <>
                        <p>{formatCurrency(Number(incomeSum))}</p>
                        <p>{monthlyBudget ? `Expected: ${formatCurrency(Number(monthlyBudget.expectedIncome))}` : 'Expected:'}</p>
                    </>
                    }
                    
                   
                </div>
                <button className="btn-add" onClick={() => { setIsModalOpen(true) }}>+</button>
            </div>
            <div className="standard-container income-content">
            <div className="income-list custom-scroll-bar">
                {isLoading && <p>Loading...</p>}
                {incomeList.map((income) => (
                    <IncomeItem key={income.id} income={income} />
                ))}
            </div>
        </div>
        </div>
    )
}
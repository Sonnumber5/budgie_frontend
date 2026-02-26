import './Dashboard.css';
import { useDashboardContext } from '../context/DashboardContext';
import { MonthPicker } from '../components/DatePicker';
import { BudgetOverview } from '../features/budget/components/BudgetOverview';
import { Modal } from '../components/modal';
import { BudgetManagementForm } from '../features/budget/components/BudgetManagementForm';
import { useState } from 'react';
import { useBudgetContext } from '../context/BudgetContext';

export const Dashboard = () => {
    const { incomeTotal, expenseTotal, currentRemaining, isLoading  } = useDashboardContext();
    const { monthlyBudget } = useBudgetContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    

    return (
        <div className="dashboard">
            <div className='month-section'>
                <MonthPicker/>
            </div>
            <div className='totals-section'>
                <div className='income-total'>
                    {isLoading ? 'Loading...' : `Total income: ${incomeTotal}`}
                </div>
                <div className='expenses-total'>
                    Total expenses: ${expenseTotal}
                </div>
                <div className='remaining-total'>
                    Total remaining: ${currentRemaining}
                </div>
                <div className='net-worth-total'>
                    Section 4
                </div>
            </div>
            <div className='budget-funds-balance-sections'>
                <div className='budget-section'>
                    <button onClick={() => {setIsModalOpen(true)}}>Edit</button>
                    <BudgetOverview/>
                    <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Save">
                        <BudgetManagementForm budgetToEdit={monthlyBudget ? monthlyBudget : null} onSuccess={() => {setIsModalOpen(false)}}/>
                    </Modal>
                </div>
                <div className='balances-categories-section'>
                    <div className='balances-section'>

                    </div>
                    <div className='categories-section'>

                    </div>
                </div>
            </div>
        </div>
    )
}
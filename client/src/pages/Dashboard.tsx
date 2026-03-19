// Dashboard.tsx - Main overview page showing the user's financial summary for the selected month.
// Displays total income, total expenses, and remaining balance fetched from DashboardContext.
// The budget section shows a BudgetOverview and an Edit button that opens BudgetManagementForm.
// The balances and categories sections are placeholders for future functionality.
import './Dashboard.css';
//import { useDashboardContext } from '../context/DashboardContext';
import { MonthPicker } from '../components/DatePicker';
import { BudgetOverview } from '../features/budget/components/BudgetOverview';
import { Modal } from '../components/Modal';
import { BudgetManagementForm } from '../features/budget/components/BudgetManagementForm';
import { useState } from 'react';
import { useBudgetContext } from '../context/BudgetContext';
import { useFundTransactionContext } from '../context/FundTransactionContext';
import { useIncomeContext } from '../context/IncomeContext';
import { useExpenseContext } from '../context/ExpenseContext';
import { useAccountBalanceContext } from '../context/AccountBalanceContext';
import { useSavingsFundContext } from '../context/SavingsFundContext';
import { Fund } from '../features/savings-funds/components/Fund';
import { AccountBalanceForm } from '../features/account-balances/components/AccountBalanceForm';
import { AccountBalanceItem } from '../features/account-balances/components/AccountBalanceItem';
import { FundPreview } from '../features/savings-funds/components/FundPreview';

export const Dashboard = () => {
    const { incomeSum, isLoading: isIncomeLoading } = useIncomeContext();
    const { expenseSum, isLoading: isExpensesLoading } = useExpenseContext();
    const { monthlyBudget } = useBudgetContext();
    const { monthlyContributionSum } = useFundTransactionContext();
    const { accountBalances } = useAccountBalanceContext();
    const { activeSavingsFunds } = useSavingsFundContext();
    const [ isBudgetModalOpen, setIsBudgetModalOpen ] = useState(false);
    const [ isAccountBalanceModalOpen, setIsAccountBalanceModalOpen ] = useState(false);

    const isLoading = isIncomeLoading || isExpensesLoading;
    

    return (
        <div className="dashboard">
            <Modal isOpen={isBudgetModalOpen} onClose={() => {setIsBudgetModalOpen(false)}} title="Save">
                <BudgetManagementForm budgetToEdit={monthlyBudget ?? null} onSuccess={() => {setIsBudgetModalOpen(false)}}/>
            </Modal>
            <Modal isOpen={isAccountBalanceModalOpen} onClose={() => {setIsAccountBalanceModalOpen(false)}} title="Save">
                <AccountBalanceForm onSuccess={() => {setIsAccountBalanceModalOpen(false)}}/>
            </Modal>
            <div className='month-section'>
                <MonthPicker/>
            </div>
            <div className='totals-section'>
                <div className='income-total'>
                    {isLoading ? 'Loading...' : `Total income: ${incomeSum}`}
                </div>
                <div className='expenses-total'>
                    Total expenses: ${expenseSum}
                </div>
                <div className='remaining-total'>
                    <div>
                        Current Remaining: ${incomeSum - expenseSum - monthlyContributionSum}
                    </div>
                    <div>
                        Total: ${incomeSum - expenseSum}
                    </div>
                    <div>
                        Fund Contributions: ${monthlyContributionSum}
                    </div>
                </div>
                <div className='net-worth-total'>
                    Section 4
                </div>
            </div>
            <div className='budget-funds-balance-sections'>
                <div className='budget-section'>
                    <button onClick={() => {setIsBudgetModalOpen(true)}}>Edit</button>
                    <BudgetOverview/>
                </div>
                <div className='fund-balance-section'>
                    <div className='fund-section'>
                        {activeSavingsFunds.map(savingsFund => (
                            <FundPreview key={savingsFund.id} fund={savingsFund}/>
                        ))}
                    </div>
                    <div className='balance-section'>
                        <button onClick={() => {setIsAccountBalanceModalOpen(true)}}>+</button>
                        {accountBalances.map(accountBalance => (
                            <AccountBalanceItem key={accountBalance.id} accountBalance={accountBalance} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
// Dashboard.tsx - Main overview page showing the user's financial summary for the selected month.
// Displays total income, total expenses, and remaining balance fetched from DashboardContext.
// The budget section shows a BudgetOverview and an Edit button that opens BudgetManagementForm.
// The balances and categories sections are placeholders for future functionality.
import './Dashboard.css';
import { MonthPicker } from '../components/DatePicker';
import { BudgetOverview } from '../features/budget/components/BudgetOverview';
import { Modal } from '../components/modal';
import { BudgetManagementForm } from '../features/budget/components/BudgetManagementForm';
import { useState } from 'react';
import { useBudgetContext } from '../context/BudgetContext';
import { useFundTransactionContext } from '../context/FundTransactionContext';
import { useIncomeContext } from '../context/IncomeContext';
import { useExpenseContext } from '../context/ExpenseContext';
import { useAccountBalanceContext } from '../context/AccountBalanceContext';
import { useSavingsFundContext } from '../context/SavingsFundContext';
import { AccountBalanceForm } from '../features/account-balances/components/AccountBalanceForm';
import { AccountBalanceItem } from '../features/account-balances/components/AccountBalanceItem';
import { FundPreview } from '../features/savings-funds/components/FundPreview';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';

export const Dashboard = () => {
    const { incomeSum, isLoading: isIncomeLoading } = useIncomeContext();
    const { expenseSum, isLoading: isExpensesLoading } = useExpenseContext();
    const { monthlyBudget } = useBudgetContext();
    const { monthlyContributionSum } = useFundTransactionContext();
    const { accountBalances } = useAccountBalanceContext();
    const { activeSavingsFunds } = useSavingsFundContext();
    const { financialOverview, currentRemaining, monthlyTotal } = useDashboard();
    const [ isBudgetModalOpen, setIsBudgetModalOpen ] = useState(false);
    const [ isAccountBalanceModalOpen, setIsAccountBalanceModalOpen ] = useState(false);

    const isLoading = isIncomeLoading || isExpensesLoading;

    return (
        <div className="dashboard">
            <Modal isOpen={isBudgetModalOpen} onClose={() => {setIsBudgetModalOpen(false)}} title="Monthly Budget">
                <BudgetManagementForm budgetToEdit={monthlyBudget ?? null} onSuccess={() => {setIsBudgetModalOpen(false)}}/>
            </Modal>
            <Modal isOpen={isAccountBalanceModalOpen} onClose={() => {setIsAccountBalanceModalOpen(false)}} title="Add account balance">
                <AccountBalanceForm onSuccess={() => {setIsAccountBalanceModalOpen(false)}}/>
            </Modal>
            <div className='month-section'>
                <MonthPicker/>
            </div>
            <div className='totals-section'>
                <div className='income-total'>
                    {isLoading ? 'Loading...' : `Total income: ${Number(incomeSum).toFixed(2)}`}
                </div>
                <div className='expenses-total'>
                    Total expenses: ${Number(expenseSum).toFixed(2)}
                </div>
                <div className='remaining-total'>
                    <div>
                        Current Remaining: ${Number(currentRemaining).toFixed(2)}
                    </div>
                    <div>
                        Total: ${Number(monthlyTotal).toFixed(2)}
                    </div>
                    <div>
                        Fund Contributions: ${Number(monthlyContributionSum).toFixed(2)}
                    </div>
                </div>
                <div className='net-worth-total'>
                    Financial Overview: ${Number(financialOverview).toFixed(2)}
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
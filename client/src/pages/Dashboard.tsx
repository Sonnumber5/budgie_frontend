// Dashboard.tsx - Main overview page showing the user's financial summary for the selected month.
// Displays total income, total expenses, and remaining balance fetched from DashboardContext.
// The budget section shows a BudgetOverview and an Edit button that opens BudgetManagementForm.
// The balances and categories sections are placeholders for future functionality.
import './Dashboard.css';
import { MonthPicker } from '../components/DatePicker';
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
import { useDateContext } from '../context/DateContext';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/ConfirmModal';
import { CategoryBudgetOverview } from '../features/budget/components/CategoryBudgetOverview';
import { formatCurrency } from '../utils/formatCurrency';



export const Dashboard = () => {
    const { incomeSum, isLoading: isIncomeLoading } = useIncomeContext();
    const { expenseSum, isLoading: isExpensesLoading } = useExpenseContext();
    const { monthlyBudget, totalCategoryBudget, categoryBudgets, isLoading: isCategoryBudgetsLoading } = useBudgetContext();
    const { monthlyContributionSum } = useFundTransactionContext();
    const { accountBalances, clearAccountBalances, isLoading: isAccountBalancesLoading } = useAccountBalanceContext();
    const { currentMonth } = useDateContext();
    const { activeSavingsFunds, isLoading: isActiveSavingsFundsLoading } = useSavingsFundContext();
    const { financialOverview, currentRemaining, monthlyTotal } = useDashboard();
    const [ isBudgetModalOpen, setIsBudgetModalOpen ] = useState(false);
    const [ isAccountBalanceModalOpen, setIsAccountBalanceModalOpen ] = useState(false);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);

    const navigate = useNavigate();

        // Converts the "YYYY-MM-01" date string into this format: "March 2024".
        const displayMonth = (() => {
            const [year, month] = currentMonth.split('-').slice(0, 2).map(Number);
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            return `${monthNames[month - 1]} ${year}`;
        })();

    return (
        <div className="page container">
            <Modal isOpen={isBudgetModalOpen} onClose={() => {setIsBudgetModalOpen(false)}} title={`${displayMonth} Budget`}>
                <BudgetManagementForm budgetToEdit={monthlyBudget ?? null} onSuccess={() => {setIsBudgetModalOpen(false)}}/>
            </Modal>
            <Modal isOpen={isAccountBalanceModalOpen} onClose={() => {setIsAccountBalanceModalOpen(false)}} title="Add account balance">
                <AccountBalanceForm onSuccess={() => {setIsAccountBalanceModalOpen(false)}}/>
            </Modal>
            <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => {clearAccountBalances()}}/>
            <div className='month-section'>
                <MonthPicker/>
            </div>
            <div className='container'>
                <div className='dashboard-summary'>
                    <div onClick={() => {navigate('/income')}}  className='standard-container income-dashboard-summary'>
                        <p>Income (Actual)</p>
                        {isIncomeLoading ? 'Loading...' : 
                            <>
                                <p>{formatCurrency(Number(incomeSum))}</p>
                                <p>{monthlyBudget ? `Expected: ${formatCurrency(Number(monthlyBudget.expectedIncome))}` : 'Expected:'}</p>
                            </>
                        }
                        <button onClick={() => {navigate('/income')}} className='btn-arrow-circle summary'>{`›`}</button>

                    </div>
                    <div onClick={() => {navigate('/expenses')}}  className='standard-container expense-dashboard-summary'>
                        <p>Expenses (Actual)</p>
                        {isExpensesLoading ? 'Loading...' : 
                            <>
                                <p>{formatCurrency(Number(expenseSum))}</p>
                                <p>{monthlyBudget ? `Budget: ${formatCurrency(Number(totalCategoryBudget))}` : 'Budget:'}</p>
                            </>
                        }
                        <button onClick={() => {navigate('/expenses')}} className='btn-arrow-circle summary'>{`›`}</button>
                    </div>
                    <div className='standard-container remaining-dashboard-summary'>
                    <p>Remaining</p>
                        {isIncomeLoading || isExpensesLoading ? 'Loading...' : 
                        <>
                            <p>{formatCurrency(Number(currentRemaining))}</p>
                            <p>{`Total: ${formatCurrency(Number(monthlyTotal))}`}</p>
                            <p>{`Fund Contributions: ${formatCurrency(Number(monthlyContributionSum))}`}</p>
                        </>                    
                        }

                    </div>
                    <div className='standard-container financial-overview-dashboard-summary'>
                        <p>Financial Overview</p>
                        <p>{isIncomeLoading || isExpensesLoading ? 'Loading...' : `${formatCurrency(Number(financialOverview))}`}</p>
                        <p>(Account Balances sum <span style={{whiteSpace: 'nowrap'}}>- Savings Funds sum</span>)</p>
                    </div>
                </div>
            </div>
            <div className='budget-funds-balance-sections'>
                <div className='standard-container budget-section'>
                    <div className='budget-section-header'>
                        <p>{displayMonth} Budget</p>
                        { isCategoryBudgetsLoading ? '' : 
                            <button className='btn-secondary' onClick={() => {setIsBudgetModalOpen(true)}}>Manage Budget</button>
                        }
                    </div>
                    <div className="monthly-budget custom-scroll-bar">
                        <div className="category-budget-list">
                            { categoryBudgets.length < 1 && !isCategoryBudgetsLoading &&
                                <p>No category budgets have been added to this month's budget. Add categories by selecting the "manage budget" button.</p>
                            }
                            { isCategoryBudgetsLoading ? 'Loading...' : 
                                <>
                                    {categoryBudgets.map((categoryBudget) => (
                                        <CategoryBudgetOverview key={categoryBudget.id} categoryBudget={categoryBudget}/>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className='fund-balance-section'>
                    <div className='standard-container'>
                        <div className='savings-section-header'>
                            <p>Savings Funds</p>
                            <button onClick={() => {navigate('/savings-funds')}} className='btn-arrow-circle'>{`›`}</button>
                        </div>
                        <div className='fund-section custom-scroll-bar'>
                            {activeSavingsFunds.length < 1 && !isAccountBalancesLoading &&
                                <p>There are no active savings yet.</p>
                            }
                            {isActiveSavingsFundsLoading ? 'Loading...' :
                                <>
                                    {activeSavingsFunds.map(savingsFund => (
                                        <FundPreview key={savingsFund.id} fund={savingsFund}/>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                    <div className='standard-container'>
                        <div className='account-balance-section-header'>
                            <p>Account Balances</p>
                            <div className='account-balance-section-btns'>
                                {isAccountBalancesLoading ? '' :
                                    <>
                                        <button className="btn-danger" onClick={() => {setIsConfirmModalOpen(true)}}>Clear Balances</button>
                                        <button className="btn-add" onClick={() => {setIsAccountBalanceModalOpen(true)}}>+</button>
                                    </>
                                }
                            </div>
                        </div>
                        <div className='account-balance-section custom-scroll-bar'>
                            {accountBalances.length < 1 && !isAccountBalancesLoading &&
                                <p>No account balances have been added</p>
                            }
                            {isAccountBalancesLoading ? 'Loading...' :
                                <>
                                    {accountBalances.map(accountBalance => (
                                        <AccountBalanceItem key={accountBalance.id} accountBalance={accountBalance} />
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
// ExpensesPage.tsx - Lists all expenses for the current month, grouped by budget category.
// Derives categorizedExpenses by joining the expense list against categoryBudgets from context,
// computing totalSpent and remaining for each category group.
// Expenses with no matching category are collected into a separate "Uncategorized" group.
import './ExpensesPage.css';
import { useExpenseContext } from "../context/ExpenseContext";
import { useBudgetContext } from "../context/BudgetContext";
import { CategorizedExpenses } from "../features/expenses/components/CategorizedExpenses";
import { useState } from 'react';
import { Modal } from '../components/modal';
import { ExpenseForm } from '../features/expenses/components/ExpenseForm';
import { BudgetManagementForm } from '../features/budget/components/BudgetManagementForm';
import { formatCurrency } from '../utils/formatCurrency';
import { MonthPicker } from '../components/DatePicker';


export const ExpensesPage = () => {
    const { expenses, expenseSum, isLoading } = useExpenseContext();
    const { categoryBudgets, monthlyBudget, totalCategoryBudget } = useBudgetContext();
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

    // Build one group per category budget, attaching only expenses that belong to that category.
    const categorizedExpenses = categoryBudgets.map(categoryBudget => {
        const categoryExpenses = expenses.filter(expense =>
            expense.categoryId === categoryBudget.categoryId
        );

        const totalSpent = categoryExpenses.reduce(
            (sum, expense) => sum + Number(expense.amount), 0
        );

        return {
            categoryBudget,
            expenses: categoryExpenses,
            totalSpent,
            remaining: categoryBudget.budgetedAmount - totalSpent
        }
    });


    // Collect expenses that were assigned to the "Uncategorized" category.
    const uncategorizedExpenses = expenses.filter(expense =>
        expense.categoryName === "Uncategorized"
    );

    const totalSpentUncategorized = uncategorizedExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount), 0
    );

    const progress = Math.min((expenseSum / totalCategoryBudget) * 100, 100);

    const isOverBudget = expenseSum > totalCategoryBudget;


    return (
        <div className="page container">
            <Modal isOpen={isExpenseModalOpen} onClose={() => { setIsExpenseModalOpen(false) }} title="Add Expense">
                <ExpenseForm onSuccess={() => { setIsExpenseModalOpen(false) }} />
            </Modal>
            <Modal isOpen={isBudgetModalOpen} onClose={() => { setIsBudgetModalOpen(false) }} title="Monthly Budget">
                <BudgetManagementForm budgetToEdit={monthlyBudget ?? null} onSuccess={() => { setIsBudgetModalOpen(false) }} />
            </Modal>
            <MonthPicker/>
            <div className="expense-page-menu">
                <div className='expense-dashboard-summary'>
                    <p>Expenses (Actual)</p>
                    {isLoading ? 'Loading...' :
                        <>
                            <p>{formatCurrency(Number(expenseSum))}</p>
                            <p>{monthlyBudget ? `Budget: ${formatCurrency(Number(totalCategoryBudget))}` : 'Budget:'}</p>
                        </>
                    }
                </div>
                <div className='expense-dashboard-progress-bar-btns'>
                    <div className='expense-menu-progress-bar'>
                        {isLoading ? 'Loading...' : 
                            <p>
                                <span className="text-white">{formatCurrency(Number(expenseSum))}</span>
                                <span>  </span>
                                <span> / {formatCurrency(Number(totalCategoryBudget))}</span>
                            </p>     
                        }
                        <div className='progress-bar'>
                            <div className='progress-fill expense-dashboard-progress-bar' style={{ width: isLoading ? '0%' : `${progress}%`, backgroundColor: isOverBudget ? '#BD6261' : '#FFE13C' }}></div>
                        </div>
                    </div>
                    <div className='expense-dashboard-btns'>
                        <button className='btn-secondary' onClick={() => { setIsBudgetModalOpen(true) }}>Manage Budget</button>
                        <button className='btn-add' onClick={() => { setIsExpenseModalOpen(true) }}>+</button>
                    </div>
                </div>
            </div>
            <div className="category-list">
                {isLoading && <p>Loading...</p>}
                {categoryBudgets.length < 1 && !isLoading &&
                    <p>No category budgets have been added to this month's budget. Add your expected income by selecting the "manage budget" button, and then add categories by selecting the "manage budget" button again, or you can add uncategorized expenses.</p>
                }
                {categorizedExpenses.map((expenseGroup) => {
                    return (
                        <CategorizedExpenses
                            key={expenseGroup.categoryBudget.id}
                            categoryBudget={expenseGroup.categoryBudget}
                            expenses={expenseGroup.expenses}
                            totalSpent={expenseGroup.totalSpent}
                            remaining={expenseGroup.remaining}
                        />
                    )
                })}
                {uncategorizedExpenses.length > 0 && (
                    <CategorizedExpenses
                        key="uncategorized"
                        expenses={uncategorizedExpenses}
                        totalSpent={totalSpentUncategorized}
                    />
                )}
            </div>
        </div>
    )
}
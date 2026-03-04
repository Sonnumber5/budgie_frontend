// CategoryBudgetOverview.tsx - Displays a single category budget entry as a card.
// Shows the category name, a progress bar (currently empty - to be implemented),
// and the budgeted amount.
import { useExpenseContext } from "../../../context/ExpenseContext";
import type { CategoryBudget } from "../../../types";
import './CategoryBudgetOverview.css';

interface CategoryBudgetOverviewProps {
    categoryBudget: CategoryBudget,
}

export const CategoryBudgetOverview = ({ categoryBudget }: CategoryBudgetOverviewProps) => {
    const { expenses } = useExpenseContext();

    const categoryExpenses = expenses.filter((e) => {
        return e.categoryId === categoryBudget.categoryId
    });

    const amountSpent = categoryExpenses.reduce((sum, expense) => {
        return sum + Number(expense.amount);
    }, 0)

    return (
        <div className="category-budget-overview">
            <div className="main-info">
                {categoryBudget.categoryName}
            </div>
            <div className="progress-bar">
                
            </div>
            <div className="sub-info">
                ${amountSpent} / ${categoryBudget.budgetedAmount}
            </div>
        </div>
    )
}
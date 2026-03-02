// CategoryBudgetOverview.tsx - Displays a single category budget entry as a card.
// Shows the category name, a progress bar (currently empty - to be implemented),
// and the budgeted amount.
import type { CategoryBudget } from "../../../types";
import './CategoryBudgetOverview.css';

interface CategoryBudgetOverviewProps {
    categoryBudget: CategoryBudget,
}

export const CategoryBudgetOverview = ({ categoryBudget }: CategoryBudgetOverviewProps) => {
    return (
        <div className="category-budget-overview">
            <div className="main-info">
                {categoryBudget.categoryName}
            </div>
            <div className="progress-bar">
                
            </div>
            <div className="sub-info">
                {categoryBudget.budgetedAmount}
            </div>
        </div>
    )
}
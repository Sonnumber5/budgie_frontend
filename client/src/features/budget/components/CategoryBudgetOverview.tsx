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
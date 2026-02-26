import type { CategoryBudget } from "../../../types"

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
                {categoryBudget.budgetedAmount}
            </div>
            <div className="sub-info">
                
            </div>
        </div>
    )
}
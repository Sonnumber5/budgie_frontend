import { useBudgetContext } from "../../../context/BudgetContext";
import { CategoryBudgetOverview } from "./CategoryBudgetOverview";
import './BudgetOverview.css';

export const BudgetOverview = () => {
    const { monthlyBudget, categoryBudgets, availableCategories, isLoading, error, addMonthlyBudget, editCategoryBudget, editMonthlyBudget, removeCategoryBudget, removeMonthlyBudget } = useBudgetContext();
    return (
        <div className="monthly-budget">
            <div className="category-budget-list">
                {categoryBudgets.map((categoryBudget) => (
                    <CategoryBudgetOverview key={categoryBudget.id} categoryBudget={categoryBudget}/>
                ))}
            </div>
        </div>
    )
}
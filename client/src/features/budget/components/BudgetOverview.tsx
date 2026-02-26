import { useBudgetContext } from "../../../context/BudgetContext";
import { CategoryBudgetOverview } from "./CategoryBudgetOverview";

export const BudgetOverview = () => {
    const { monthlyBudget, categoryBudgets, availableCategories, isLoading, error, createMonthlyBudget, updateCategoryBudget, updateMonthlyBudget, deleteCategoryBudget, deleteMonthlyBudget } = useBudgetContext();
    return (
        <div className="monthly-budget">
            <div className="category-budget-list">
                {categoryBudgets.map((categoryBudget) => (
                    <CategoryBudgetOverview categoryBudget={categoryBudget}/>
                ))}
            </div>
        </div>
    )
}
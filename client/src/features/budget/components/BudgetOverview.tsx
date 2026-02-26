import { useBudgetContext } from "../../../context/BudgetContext";
import { CategoryBudgetOverview } from "./CategoryBudgetOverview";

export const BudgetOverview = () => {
    const { monthlyBudget, categoryBudgets, availableCategories, isLoading, error, addMonthlyBudget, editCategoryBudget, editMonthlyBudget, removeCategoryBudget, removeMonthlyBudget } = useBudgetContext();
    return (
        <div className="monthly-budget">
            <div className="category-budget-list">
                {categoryBudgets.map((categoryBudget, index) => (
                    <CategoryBudgetOverview key={index} categoryBudget={categoryBudget}/>
                ))}
            </div>
        </div>
    )
}
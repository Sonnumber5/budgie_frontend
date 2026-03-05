
import { useEffect, useState } from "react";
import type { Category, CategoryBudget, CategoryBudgetDTO, MonthlyBudget } from "../../../types";
import { useBudgetContext } from "../../../context/BudgetContext";

interface CategoryBudgetFormProps{
    onSuccess: () => void;
    categoryBudgetToEdit?: CategoryBudget | null;
}

export const CategoryBudgetForm = ({ onSuccess, categoryBudgetToEdit }: CategoryBudgetFormProps) => {
    const { editCategoryBudget } = useBudgetContext();
    
    const [formData, setFormData] = useState({
        id: 0,
        monthlyBudgetId: 0,
        categoryName: '',
        budgetedAmount: 0
    });

    useEffect(() => {
        if (categoryBudgetToEdit) {
            setFormData({
                id: categoryBudgetToEdit.id,
                monthlyBudgetId: categoryBudgetToEdit.monthlyBudgetId,
                categoryName: categoryBudgetToEdit.categoryName,
                budgetedAmount: categoryBudgetToEdit.budgetedAmount
            });
        }
    }, [categoryBudgetToEdit]);

    if (!categoryBudgetToEdit) {
        return null;
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            await editCategoryBudget(categoryBudgetToEdit.id, formData);
            onSuccess();
        } catch(error) {
            console.error('Submit error:', error);
            alert(`Failed to update category budget`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <h3>Category Budgets</h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={formData.categoryName}
                        onChange={(e) => {setFormData({...formData, categoryName: e.target.value})}}
                        disabled
                        style={{ flex: 1 }}
                    />
                    <input
                        type="number"
                        value={formData.budgetedAmount}
                        onChange={(e) => setFormData({...formData, budgetedAmount: Number(e.target.value)})}
                        style={{ flex: 1 }}
                    />
                </div>
            </div>
            <button type="submit">
                Update
            </button>
        </form>
    )
}
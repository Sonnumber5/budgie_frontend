
import { useEffect, useState } from "react";
import type { Category, CategoryBudget, CategoryBudgetDTO, MonthlyBudget } from "../../../types";
import { useBudgetContext } from "../../../context/BudgetContext";
import { toast } from "react-toastify";
import { useDateContext } from "../../../context/DateContext";

interface CategoryBudgetFormProps{
    onSuccess: () => void;
    categoryBudgetToEdit?: CategoryBudget | null;
}

export const CategoryBudgetForm = ({ onSuccess, categoryBudgetToEdit }: CategoryBudgetFormProps) => {
    const { editCategoryBudget } = useBudgetContext();
    const { currentMonth } = useDateContext();
    
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
            toast.success(`Successfully updated category budget for ${currentMonth}`);
            onSuccess();
        } catch(err: any) {
            toast.error(err.response?.data?.error || `Failed to update category budget for ${currentMonth}`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>     
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
            <button className="btn-primary" type="submit">
                Update
            </button>
        </form>
    )
}
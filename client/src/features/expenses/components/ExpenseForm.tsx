import { useEffect, useState } from "react";
import type { Expense, ExpenseDTO } from "../../../types";
import { useExpenseContext } from "../../../context/ExpenseContext";
import { useBudgetContext } from "../../../context/BudgetContext";

interface ExpenseFormProps{
    onSuccess: () => void;
    expenseToEdit?: Expense; //will be automatically passed here when an expense is edited with the edit form
    categoryId?: number; //will be automatically passed here when creating an expense for a specific budget category
}

export const ExpenseForm = ({ onSuccess, expenseToEdit, categoryId }: ExpenseFormProps) => {
    const { addExpense, editExpense } = useExpenseContext();
    const { availableCategories } = useBudgetContext();
    const [formData, setFormData] = useState<ExpenseDTO>({
        existingCategoryId: categoryId || null,
        vendor: '',
        amount: 0,
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
    })
    const isEditMode = !!expenseToEdit;



    useEffect(() => {
        if (expenseToEdit){
            setFormData({
                existingCategoryId: expenseToEdit.categoryId,
                vendor: expenseToEdit.vendor,
                amount: expenseToEdit.amount,
                description: expenseToEdit.description,
                expenseDate: expenseToEdit.expenseDate,
            });
        }
    }, [expenseToEdit]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            if (isEditMode && expenseToEdit){
                await editExpense(expenseToEdit.id, formData)
            } else{
                await addExpense(formData);
                console.log('Expense added successfully. category id: ', categoryId);
            }
            onSuccess();
        } catch(error){
            console.error('Error adding expense:', error); 
            alert(`Failed to ${isEditMode ? 'update' : 'add'} expense`)
        }
    }

    const selectCategory = () => {
        if (!categoryId){
            return (
                <div>
                    <label>Category</label>
                    <select
                        value={formData.existingCategoryId ?? ""}
                        onChange={(e) => setFormData({...formData, existingCategoryId: Number(e.target.value)})}>
                            <option value="" disabled>Select a category</option>
                            {availableCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </div>
            )
        }
        return null;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Vendor</label>
                <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    required
                />
            </div>
            <div>
                <label>Amount</label>
                <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    required
                />
            </div>
            {selectCategory()}
            <div>
                <label>Description</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div>
                <label>Date</label>
                <input
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
                    required
                />
            </div>
            <button type="submit">
                {isEditMode ? 'Update Expense' : 'Add Expense'}
            </button>
        </form>
    )
}
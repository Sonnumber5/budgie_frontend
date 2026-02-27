import { useEffect, useState } from "react";
import type { Expense, ExpenseDTO } from "../../../types";
import { useExpenseContext } from "../../../context/ExpenseContext";
import { useBudgetContext } from "../../../context/BudgetContext";

interface ExpenseFormProps{
    onSuccess: () => void;
    expenseToEdit?: Expense;
    categoryId: number;
}

export const ExpenseForm = ({ onSuccess, expenseToEdit, categoryId }: ExpenseFormProps) => {
    const { addExpense, editExpense } = useExpenseContext();
    const { availableCategories } = useBudgetContext();
    const [formData, setFormData] = useState<ExpenseDTO>({
        existingCategoryId: categoryId,
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
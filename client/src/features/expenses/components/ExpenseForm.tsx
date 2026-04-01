// ExpenseForm.tsx - Form for creating or editing an expense.
// When categoryId is provided (e.g. from CategorizedExpenses), the category dropdown is hidden
// and the expense is pre-assigned to that category. When expenseToEdit is provided
// the form pre-fills with the existing data and submits an update instead of a create.
import { useEffect, useState } from "react";
import type { Expense, ExpenseDTO } from "../../../types";
import { useExpenseContext } from "../../../context/ExpenseContext";
import { useBudgetContext } from "../../../context/BudgetContext";
import { useDateContext } from "../../../context/DateContext";
import { toast } from 'react-toastify';
import './ExpenseForm.css';

interface ExpenseFormProps{
    onSuccess: () => void;
    expenseToEdit?: Expense; //will be automatically passed here when an expense is edited with the edit form
    categoryId?: number; //will be automatically passed here when creating an expense for a specific budget category
}

export const ExpenseForm = ({ onSuccess, expenseToEdit, categoryId }: ExpenseFormProps) => {
    const { addExpense, editExpense } = useExpenseContext();
    const { availableCategories } = useBudgetContext();
    const { currentMonth } = useDateContext();
    const [formData, setFormData] = useState<ExpenseDTO>({
        existingCategoryId: categoryId || null,
        vendor: '',
        amount: 0,
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
        month: currentMonth
    });
    const isEditMode = !!expenseToEdit;



    useEffect(() => {
        if (expenseToEdit){
            setFormData({
                existingCategoryId: expenseToEdit.categoryId,
                vendor: expenseToEdit.vendor,
                amount: expenseToEdit.amount,
                description: expenseToEdit.description,
                expenseDate: new Date(expenseToEdit.expenseDate).toISOString().split('T')[0],
                month: currentMonth
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
            }
            toast.success(`Successfully ${isEditMode ? 'updated' : 'added'} expense`);
            onSuccess();
        } catch(err: any){
            toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} expense`)
        }
    }

    // selectCategory renders the category dropdown only when no categoryId was pre-assigned.
    // This keeps the UI clean when adding an expense directly within a budget category group.
    const selectCategory = () => {
        if (!categoryId){
            return (
                <div className="form-field-category">
                    <label>Category</label>
                    <select
                        className="select-field-standard"
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
            <div className="expense-form-body">
                <div className="form-field-vendor-amount">
                    <div className="form-field-vendor">
                        <label>Vendor</label>
                        <input
                            className="input-field-standard"
                            type="text"
                            value={formData.vendor}
                            onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                            required
                        />
                    </div>
                    <div  className="form-field-amount">
                        <label>Amount</label>
                        <input
                            className="input-field-standard"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                            required
                            min={0}
                            step="0.01"
                        />
                    </div>
                </div>
                <div className="form-field-category-date">
                    {selectCategory()}
                    <div className="form-field-date">
                        <label>Date</label>
                        <input
                            className="date-field-standard"
                            type="date"
                            value={formData.expenseDate}
                            onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
                            required
                        />
                    </div>
                </div>
                <div className="form-field-description">
                    <label>Description</label>
                    <input
                        className="input-field-standard"
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>
            </div>
            <button className="btn-primary" type="submit">
                {isEditMode ? 'Update Expense' : 'Add Expense'}
            </button>
        </form>
    )
}
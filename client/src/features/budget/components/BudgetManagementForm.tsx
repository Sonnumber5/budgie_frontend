// BudgetManagementForm.tsx - Form for creating or editing a monthly budget.
// Handles two separate lists of category budgets:
//   existingCategoryBudgets: already-saved entries shown as read-only (can only be deleted).
//   newCategoryBudgets: rows added during the current editing session that will be submitted.
// When budgetToEdit is provided the form operates in edit mode; otherwise it creates a new budget.
import { useEffect, useState } from "react";
import type { Category, CategoryBudget, CategoryBudgetDTO, MonthlyBudget } from "../../../types";
import { useBudgetContext } from "../../../context/BudgetContext";

interface BudgetManagementForm{
    onSuccess: () => void;
    budgetToEdit?: MonthlyBudget | null;
}

export const BudgetManagementForm = ({ onSuccess, budgetToEdit }: BudgetManagementForm) => {
    const { addMonthlyBudget, editMonthlyBudget, removeCategoryBudget } = useBudgetContext();
    const [ expectedIncome, setExpectedIncome ] = useState(0);
    const [ existingCategoryBudgets, setExistingCategoryBudgets ] = useState<CategoryBudget[]>([]);
    const [ newCategoryBudgets, setNewCategoryBudgets ] = useState<CategoryBudgetDTO[]>([]);

    const isEditMode = !!budgetToEdit;

    useEffect(() => {
        if (budgetToEdit){
            setExpectedIncome(budgetToEdit.expectedIncome);
            setExistingCategoryBudgets(budgetToEdit.categoryBudgets || []);
        }
    }, [budgetToEdit]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            if (isEditMode && budgetToEdit){
                await editMonthlyBudget(budgetToEdit.id, {
                    expectedIncome: expectedIncome, 
                    categoryBudgetDTOs: newCategoryBudgets 
                });
            } else{
                await addMonthlyBudget({
                    expectedIncome: expectedIncome,
                    categoryBudgetDTOs: newCategoryBudgets 
                });
            }
            onSuccess();
        } catch(error) {
            console.error('Submit error:', error);
            alert(`Failed to ${isEditMode ? 'update' : 'add'} budget`);
        }
    }

    // addNewCategoryBudget appends a blank category budget row to the new-budgets list.
    const addNewCategoryBudget = () => {
        setNewCategoryBudgets([
            ...newCategoryBudgets, 
            { categoryName: '', budgetedAmount: 0 }
        ]);
    }

    const removeNewCategoryBudget = (index: number) => {
        setNewCategoryBudgets(newCategoryBudgets.filter((_, i) => i !== index));
    };

    const updateNewCategoryBudget = (index: number, field: 'categoryName' | 'budgetedAmount', value: string | number) => {
        setNewCategoryBudgets(
            newCategoryBudgets.map((cb, i) =>
                i === index ? { ...cb, [field]: value } : cb
            )
        );
    };

    // handleDeleteExisting deletes a saved category budget immediately via the API
    // and removes it from the local existingCategoryBudgets list.
    const handleDeleteExisting = async (categoryBudgetId: number) => {
        if (window.confirm('Are you sure you want to delete this category budget?')) {
            try {
                await removeCategoryBudget(categoryBudgetId);
                setExistingCategoryBudgets(existing => 
                    existing.filter(cb => cb.id !== categoryBudgetId)
                );
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete category budget');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Expected Income</label>
                <input
                    type="number"
                    value={expectedIncome}
                    onChange={(e) => setExpectedIncome(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <h3>Category Budgets</h3>
                
                {existingCategoryBudgets.length > 0 && (
                    <div>
                        <h4>Existing Budgets</h4>
                        {existingCategoryBudgets.map((cb) => (
                            <div key={cb.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    value={cb.categoryName}
                                    disabled
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    value={cb.budgetedAmount}
                                    disabled
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteExisting(cb.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {newCategoryBudgets.length > 0 && (
                    <div>
                        <h4>New Budgets</h4>
                        {newCategoryBudgets.map((cb, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={cb.categoryName}
                                    onChange={(e) => updateNewCategoryBudget(index, 'categoryName', e.target.value)}
                                    required
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    placeholder="Budget Amount"
                                    value={cb.budgetedAmount}
                                    onChange={(e) => updateNewCategoryBudget(index, 'budgetedAmount', Number(e.target.value))}
                                    required
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNewCategoryBudget(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button type="button" onClick={addNewCategoryBudget}>
                    + Add Category Budget
                </button>
            </div>
            <button type="submit">
                {isEditMode ? 'Update Budget' : 'Create Budget'}
            </button>
        </form>
    )
}
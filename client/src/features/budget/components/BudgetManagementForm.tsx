// BudgetManagementForm.tsx - Form for creating or editing a monthly budget.
// Handles two separate lists of category budgets:
//   existingCategoryBudgets: already-saved entries shown as read-only (can only be deleted).
//   newCategoryBudgets: rows added during the current editing session that will be submitted.
// When budgetToEdit is provided the form operates in edit mode; otherwise it creates a new budget.
import { useEffect, useState } from "react";
import type { CategoryBudget, CategoryBudgetDTO, MonthlyBudget } from "../../../types";
import { useBudgetContext } from "../../../context/BudgetContext";
import { standardCategories } from "../../../types/standardCategories";
import { toast } from "react-toastify";
import { useDateContext } from "../../../context/DateContext";
import { ConfirmModal } from "../../../components/ConfirmModal";

interface BudgetManagementFormProps{
    onSuccess: () => void;
    budgetToEdit?: MonthlyBudget | null;
}

export const BudgetManagementForm = ({ onSuccess, budgetToEdit }: BudgetManagementFormProps) => {
    const { addMonthlyBudget, editMonthlyBudget, removeCategoryBudget } = useBudgetContext();
    const { currentMonth } = useDateContext();
    const [ expectedIncome, setExpectedIncome ] = useState(0);
    const [ existingCategoryBudgets, setExistingCategoryBudgets ] = useState<CategoryBudget[]>([]);
    const [ newCategoryBudgets, setNewCategoryBudgets ] = useState<CategoryBudgetDTO[]>([]);
    const [ isConfirmModalOpen, setIsConfirmModalOpen ] = useState(false);
    const [ categoryBudgetToDelete, setCategoryBudgetToDelete ] = useState<number | null>(null);

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
            toast.success(`Successfully ${isEditMode ? 'updated' : 'created'} budget for ${currentMonth}`);
            onSuccess();
        } catch(err: any) {
            toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} budget for ${currentMonth}`);
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
        try {
            await removeCategoryBudget(categoryBudgetId);
            setExistingCategoryBudgets(existing => 
                existing.filter(cb => cb.id !== categoryBudgetId)
            );
            toast.success(`Successfully deleted category from ${currentMonth}`);
        } catch (err: any) {
            toast.error(err.response?.data?.error || `Failed to delete category from ${currentMonth}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => {setIsConfirmModalOpen(false)}} confirmAction={() => { categoryBudgetToDelete && handleDeleteExisting(categoryBudgetToDelete)}} />
            <div className="form-body-standard">
                <div className="form-field-standard">
                    <label>Expected Income</label>
                    <input
                        className="input-field-standard"
                        type="number"
                        value={expectedIncome}
                        onChange={(e) => setExpectedIncome(Number(e.target.value))}
                        required
                        min={0}
                        step="0.01"
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <h3>Category Budgets</h3>
                    {existingCategoryBudgets.length > 0 && (
                        <div>
                            <h4>Existing Budgets</h4>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                {existingCategoryBudgets.map((cb) => (
                                    <div className="form-field-group-standard" key={cb.id}>
                                        <div className="form-field-standard">
                                            <input
                                                className="input-field-standard"
                                                type="text"
                                                value={cb.categoryName}
                                                disabled
                                            />
                                        </div>
                                        <div className="form-field-standard">
                                            <input
                                                className="input-field-standard"
                                                type="number"
                                                value={cb.budgetedAmount}
                                                disabled
                                            />
                                        </div>
                                        <button
                                        className="btn-x"
                                            type="button"
                                            onClick={() => {setIsConfirmModalOpen(true); setCategoryBudgetToDelete(cb.id)}}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {newCategoryBudgets.length > 0 && (
                        <div>
                            <h4>New Budgets</h4>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                {newCategoryBudgets.map((cb, index) => (
                                    <div className="form-field-group-standard" key={index}>
                                        <div className="form-field-standard">
                                            <input
                                                className="input-field-standard"
                                                type="text"
                                                placeholder="Category Name"
                                                value={cb.categoryName}
                                                onChange={(e) => updateNewCategoryBudget(index, 'categoryName', e.target.value)}
                                                list={`category-suggestions-${index}`} // Links to datalist
                                                required
                                            />
                                            <datalist id={`category-suggestions-${index}`}>
                                                {standardCategories.map(category => (
                                                    <option key={category} value={category} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div className="form-field-standard">
                                            <input
                                                className="input-field-standard"
                                                type="number"
                                                placeholder="Budget Amount"
                                                value={cb.budgetedAmount}
                                                onChange={(e) => updateNewCategoryBudget(index, 'budgetedAmount', Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                        <button
                                            className="btn-x"
                                            type="button"
                                            onClick={() => removeNewCategoryBudget(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div style={{display: 'flex', justifyContent: 'center'}} >
                        <button className="btn-add" type="button" onClick={addNewCategoryBudget}>
                            +
                        </button>
                    </div>
                </div>
            </div>
            <button className="btn-primary" type="submit">
                {isEditMode ? 'Update Budget' : 'Create Budget'}
            </button>
        </form>
    )
}
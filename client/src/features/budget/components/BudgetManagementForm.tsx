// BudgetManagementForm.tsx - Form for creating or editing a monthly budget.
// Handles two separate lists of category budgets:
//   existingCategoryBudgets: already-saved entries shown as read-only (can only be deleted).
//   newCategoryBudgets: rows added during the current editing session that will be submitted.
// When budgetToEdit is provided the form operates in edit mode; otherwise it creates a new budget.
import { useEffect, useState } from "react";
import type { CategoryBudget, CategoryBudgetDTO, DefaultBudgetDTO, DefaultCategoryBudget, DefaultCategoryBudgetDTO, MonthlyBudget } from "../../../types";
import { useBudgetContext } from "../../../context/BudgetContext";
import { standardCategories } from "../../../types/standardCategories";
import { toast } from "react-toastify";
import { useDateContext } from "../../../context/DateContext";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useDefaultBudgets } from "../../default-budgets/hooks/useDefaultBudgets";
import { ConfirmButtons } from "../../../components/ConfirmButtons";

interface BudgetManagementFormProps {
    onSuccess: () => void;
    budgetToEdit?: MonthlyBudget | null;
}

export const BudgetManagementForm = ({ onSuccess, budgetToEdit }: BudgetManagementFormProps) => {
    const { getDefaultBudget, saveDefaultBudget, isSaveLoading: isDefaultBudgetSaveLoading, isLoadLoading: isDefaultBudgetLoadLoading } = useDefaultBudgets();
    const { addMonthlyBudget, editMonthlyBudget, removeCategoryBudget } = useBudgetContext();
    const { currentMonth } = useDateContext();
    const [expectedIncome, setExpectedIncome] = useState(0);
    const [existingCategoryBudgets, setExistingCategoryBudgets] = useState<CategoryBudget[]>([]);
    const [newCategoryBudgets, setNewCategoryBudgets] = useState<CategoryBudgetDTO[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [categoryBudgetToDelete, setCategoryBudgetToDelete] = useState<number | null>(null);
    const [ isConfirmGetDefaultOpen, setIsConfirmGetDefaultOpen ] = useState(false);
    const [ isConfirmSaveDefaultOpen, setIsConfirmSaveDefaultOpen ] = useState(false);

    const isEditMode = !!budgetToEdit;

    useEffect(() => {
        if (budgetToEdit) {
            setExpectedIncome(budgetToEdit.expectedIncome);
            setExistingCategoryBudgets(budgetToEdit.categoryBudgets || []);
        }
    }, [budgetToEdit]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && budgetToEdit) {
                await editMonthlyBudget(budgetToEdit.id, {
                    expectedIncome: expectedIncome,
                    categoryBudgetDTOs: [
                        ...existingCategoryBudgets.map(cb => ({
                            id: cb.id,
                            categoryId: cb.categoryId,
                            categoryName: cb.categoryName,
                            budgetedAmount: cb.budgetedAmount
                        })), 
                        ...newCategoryBudgets.map(cb => ({
                            categoryId: cb.categoryId,
                            categoryName: cb.categoryName,
                            budgetedAmount: cb.budgetedAmount
                        }))
                    ]
                });
            } else {
                await addMonthlyBudget({
                    expectedIncome: expectedIncome,
                    categoryBudgetDTOs: newCategoryBudgets
                });
            }
            toast.success(`Successfully ${isEditMode ? 'updated' : 'created'} budget for ${currentMonth}`);
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} budget for ${currentMonth}`);
        }
    }

    const handleGetDefaultBudget = async () => {
        try {
            const result = await getDefaultBudget();

            const newDefaultCategoryBudgets = result.defaultCategoryBudgets.filter((category) =>
                !existingCategoryBudgets.find((existing) => existing.categoryId === category.categoryId) &&
                !newCategoryBudgets.find((newCb) => newCb.categoryId === category.categoryId)
            );

            setExpectedIncome(result.expectedIncome);
            setNewCategoryBudgets(newDefaultCategoryBudgets);
            toast.success('Successfully applied default budget');

        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to retrieve default budget');
        }
    }

    const handleSaveDefaultBudget = async () => {
        try {
            const allCategoryBudgets: DefaultCategoryBudgetDTO[] = [
                ...existingCategoryBudgets.map((category) => ({
                id: category.id,
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                budgetedAmount: Number(category.budgetedAmount),
            })), ...newCategoryBudgets.map((category) => ({
                categoryName: category.categoryName,
                budgetedAmount: Number(category.budgetedAmount),
            }))
        ]
            const newDefaultBudget: DefaultBudgetDTO = {
                expectedIncome: expectedIncome,
                defaultCategoryBudgetDTOs: allCategoryBudgets
            }

            await saveDefaultBudget(newDefaultBudget);
            toast.success('Successfully saved default budget');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save default budget');
        }
    }

    const handleUpdateExistingCategoryBudgetAmount = (id: number, budgetedAmount: number) => {
        setExistingCategoryBudgets((existing) => 
            existing.map(cb => cb.id === id ? {...cb, budgetedAmount: budgetedAmount} : cb)
        );
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
            <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => { setIsConfirmModalOpen(false) }} confirmAction={() => { categoryBudgetToDelete && handleDeleteExisting(categoryBudgetToDelete) }} />
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
                
                    <div className="custom-scroll-bar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'scroll' }}>
                        <h3>Category Budgets</h3>
                        {existingCategoryBudgets.length > 0 && (
                            <div>
                                <h4>Existing Budgets</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {existingCategoryBudgets.map((cb) => (
                                        <div className="form-field-group-standard" key={cb.id}>
                                            <div className="form-field-standard">
                                                <input
                                                    className="input-field-standard"
                                                    type="text"
                                                    value={cb.categoryName}
                                                    disabled
                                                    required
                                                />
                                            </div>
                                            <div className="form-field-standard">
                                                <input
                                                    className="input-field-standard"
                                                    type="number"
                                                    value={cb.budgetedAmount === 0 ? '' : cb.budgetedAmount}
                                                    onChange={(e) => {handleUpdateExistingCategoryBudgetAmount(cb.id, Number(e.target.value))}}
                                                    
                                                />
                                            </div>
                                            <button
                                                className="btn-x"
                                                type="button"
                                                onClick={() => { setIsConfirmModalOpen(true); setCategoryBudgetToDelete(cb.id) }}
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {newCategoryBudgets.map((cb, index) => (
                                        <div className="form-field-group-standard" key={index}>
                                            <div className="form-field-standard">
                                                <input
                                                    className="input-field-standard"
                                                    type="text"
                                                    placeholder="Category Name"
                                                    value={cb.categoryName}
                                                    onChange={(e) => updateNewCategoryBudget(index, 'categoryName', e.target.value)}
                                                    list={`category-suggestions-${index}`} 
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
                    </div>
                
                <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <button className="btn-add" type="button" onClick={addNewCategoryBudget}>
                        +
                    </button>
                </div>
            </div>
            <div className="multiple-form-btns">
                {!isConfirmGetDefaultOpen && !isConfirmSaveDefaultOpen &&
                    <div className="multiple-form-btns">
                        <button className="btn-primary" type="submit">{isEditMode ? 'Update Budget' : 'Create Budget'}</button>
                        <button onClick={() => { handleGetDefaultBudget() }} className="btn-secondary" type="button" disabled={isDefaultBudgetLoadLoading}>{isDefaultBudgetLoadLoading ? 'Loading...' : 'Default Budget'}</button>
                        <button onClick={() => { setIsConfirmSaveDefaultOpen(true) }} className="btn-secondary" type="button" disabled={isDefaultBudgetSaveLoading}>{isDefaultBudgetSaveLoading ? 'Loading...' : 'Save Default Budget'}</button>
                    </div>
                }
                {isConfirmSaveDefaultOpen &&
                    <ConfirmButtons confirmAction={() => {handleSaveDefaultBudget()}} cancelAction={() => {setIsConfirmSaveDefaultOpen(false)}}/>
                }
            </div>
        </form>
    )
}
// IncomeForm.tsx - Form for creating or editing an income entry.
// When incomeToEdit is provided the form pre-fills and submits an update;
// otherwise it creates a new income record.
import { useEffect, useState } from "react";
import type { Income, IncomeDTO } from "../../../types";
import { useIncomeContext } from "../../../context/IncomeContext";

interface IncomeFormProps{
    onSuccess: () => void;
    incomeToEdit?: Income;
}

export const IncomeForm = ({ onSuccess, incomeToEdit }: IncomeFormProps) => {
    const { addIncome, editIncome } = useIncomeContext();
    const [formData, setFormData] = useState({
        amount: 0,
        source: '',
        description: '',
        incomeDate: new Date().toISOString().split('T')[0]
    })
    const isEditMode = !!incomeToEdit;

    useEffect(() => {
        if (incomeToEdit){
            setFormData({
                amount: incomeToEdit.amount,
                source: incomeToEdit.source,
                description: '',
                incomeDate: incomeToEdit.incomeDate
            });
        }
    }, [incomeToEdit]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            if (isEditMode && incomeToEdit){
                await editIncome(incomeToEdit.id, formData)
            } else{
                await addIncome(formData);
            }
            onSuccess();
        } catch(error){
            alert(`Failed to ${isEditMode ? 'update' : 'add'} income`)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Source</label>
                <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
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
                <label>Date</label>
                <input
                    type="date"
                    value={formData.incomeDate}
                    onChange={(e) => setFormData({...formData, incomeDate: e.target.value})}
                    required
                />
            </div>
            <button type="submit">
                {isEditMode ? 'Update Income' : 'Add Income'}
            </button>
        </form>
    )
}
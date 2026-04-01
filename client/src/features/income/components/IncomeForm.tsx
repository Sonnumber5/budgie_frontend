// IncomeForm.tsx - Form for creating or editing an income entry.
// When incomeToEdit is provided the form pre-fills and submits an update;
// otherwise it creates a new income record.
import { useEffect, useState } from "react";
import type { Income, IncomeDTO } from "../../../types";
import { useIncomeContext } from "../../../context/IncomeContext";
import { toast } from "react-toastify";
import './IncomeForm.css';

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
                description: incomeToEdit.description,
                incomeDate: new Date(incomeToEdit.incomeDate).toISOString().split('T')[0]
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
            toast.success(`Successfully ${isEditMode ? 'updated' : 'created'} income entry`);
            onSuccess();
        } catch(err: any){
            toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} income record`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="income-form-body">
                <div className="form-field-income-source">
                    <label>Source</label>
                    <input
                        className="input-field-standard"
                        type="text"
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        required
                    />
                </div>
                <div className="form-field-income-amount-date">
                    <div className="form-field-income-amount">
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
                    <div className="form-field-income-date">
                        <label>Date</label>
                        <input
                            className="input-field-standard"
                            type="date"
                            value={formData.incomeDate}
                            onChange={(e) => setFormData({...formData, incomeDate: e.target.value})}
                            required
                        />
                    </div>
                </div>
            </div>
            <button className="btn-primary" type="submit">
                {isEditMode ? 'Update Income' : 'Add Income'}
            </button>
        </form>
    )
}
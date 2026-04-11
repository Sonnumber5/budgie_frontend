import { useState } from "react";
import type { SavingsFund } from "../../../types";
import { useDateContext } from "../../../context/DateContext";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import { toast } from 'react-toastify';

interface AdjustmentTransactionFormProps{
    onSuccess: () => void;
    fund: SavingsFund
}

// Form for setting a savings fund's balance to an exact amount via an adjustment transaction.
export const AdjustmentTransactionForm = ({ onSuccess, fund }: AdjustmentTransactionFormProps) => {
    const { addAdjustTransaction } = useFundTransactionContext();
    const { currentMonth } = useDateContext();
    const [formData, setFormData] = useState({
        savingsFundId: fund.id,
        amount: fund.balance || 0,
        month: currentMonth
    });

    // Submits the adjustment to update the fund balance, then calls onSuccess on completion.
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            await addAdjustTransaction(formData);
            toast.success('Successfully adjusted fund balance');
            onSuccess();
        } catch(err: any){
            toast.error(err.response?.data?.error || 'Failed to adjust account balance');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-body-standard">
                <div className="form-field-standard">
                    <label>Amount</label>
                    <input
                        className="input-field-standard"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                        required
                    />
                </div>
            </div>
            <button className="btn-primary" type="submit">
                Update balance
            </button>
        </form>
    )
}
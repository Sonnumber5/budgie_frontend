import { useState } from "react";
import type { SavingsFund } from "../../../types";
import { useDateContext } from "../../../context/DateContext";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import { toast } from 'react-toastify';

interface AdjustmentTransactionFormProps{
    onSuccess: () => void;
    fund: SavingsFund
}

export const AdjustmentTransactionForm = ({ onSuccess, fund }: AdjustmentTransactionFormProps) => {
    const { addAdjustTransaction } = useFundTransactionContext();
    const { currentMonth } = useDateContext();
    const [formData, setFormData] = useState({
        savingsFundId: fund.id,
        amount: fund.balance || 0,
        month: currentMonth
    });

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
            <div>
                <label>Amount</label>
                <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    required
                />
            </div>
            <button className="btn-primary" type="submit">
                Update balance
            </button>
        </form>
    )
}
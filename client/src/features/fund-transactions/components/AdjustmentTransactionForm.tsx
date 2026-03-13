import { useEffect, useState } from "react";
import type { FundTransaction, FundTransactionDTO, SavingsFund } from "../../../types";
import { useDateContext } from "../../../context/DateContext";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import type { TransactionType } from "../../../types";

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
            console.log('Adjustment transaction successfully created');
            onSuccess();
        } catch(error){
            console.error('Error adding adjustment transaction:', error); 
            alert(`Failed to create adjustment transaction`)
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
            <button type="submit">
                Update balance
            </button>
        </form>
    )
}
import { useState } from "react";
import { useDateContext } from "../../../context/DateContext";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";
import { toast } from "react-toastify";

interface TransferFundFormProps{
    onSuccess: () => void;
}

export const TransferFundForm = ({ onSuccess }: TransferFundFormProps) => {
    const { addTransferTransaction } = useFundTransactionContext();
    const { currentMonth } = useDateContext();
    const { activeSavingsFunds } = useSavingsFundContext();
    const [formData, setFormData] = useState({
        sendingFundId: "" as number | "",
        receivingFundId: "" as number | "",
        amount: 0,
        month: currentMonth
    });

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!formData.sendingFundId || !formData.receivingFundId) {
            toast.error('Please select both funds');
            return;
        }
        if (formData.sendingFundId === formData.receivingFundId) {
            toast.error('Sending and receiving funds cannot be the same');
            return;
        }
        
        try{
            await addTransferTransaction({...formData, sendingFundId: Number(formData.sendingFundId), receivingFundId: Number(formData.receivingFundId)});
            toast.success('Successfully transferred funds');
            onSuccess();
        } catch(err: any){
            toast.error(err.response?.data?.error || 'Could not transfer funds');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>From</label>
                <select
                    required
                    value={formData.sendingFundId ?? ""}
                    onChange={(e) => setFormData({...formData, sendingFundId: e.target.value ?  Number(e.target.value) : ""})}>
                    <option value="" disabled>Select sending fund</option>
                    {activeSavingsFunds.map(fund => (
                        <option key={fund.id} value={fund.id}>
                            {fund.name}
                        </option>
                    ))}
                </select>
                <label>To</label>
                <select
                    required
                    value={formData.receivingFundId ?? ""}
                    onChange={(e) => setFormData({...formData, receivingFundId: e.target.value?  Number(e.target.value) : ""})}>
                    <option value="" disabled>Select receiving fund</option>
                    {activeSavingsFunds
                        .filter(fund => fund.id !== formData.sendingFundId)
                        .map(fund => (
                            <option key={fund.id} value={fund.id}>
                                {fund.name}
                            </option>
                        ))
                    }
                </select>
                <label>Amount</label>
                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    required
                />
            </div>
            <button className="btn-primary" type="submit">
                Transfer
            </button>
        </form>
    )
}
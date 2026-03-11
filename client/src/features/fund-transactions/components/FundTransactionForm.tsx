import { useEffect, useState } from "react";
import type { FundTransaction, FundTransactionDTO } from "../../../types";
import { useDateContext } from "../../../context/DateContext";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import type { TransactionType } from "../../../types";

interface FundTransactionFormProps{
    onSuccess: () => void;
    transactionToEdit?: FundTransaction; //will be automatically passed here when a transaction is edited with the edit form
    fundId: number;
}

export const FundTransactionForm = ({ onSuccess, transactionToEdit, fundId }: FundTransactionFormProps) => {
    const { addFundTransaction, editFundTransaction } = useFundTransactionContext();
    const { currentMonth } = useDateContext();
    const [formData, setFormData] = useState<FundTransactionDTO>({
        savingsFundId: fundId,
        transactionType: '',
        amount: 0,
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
        month: currentMonth
    });
    const isEditMode = !!transactionToEdit;



    useEffect(() => {
        if (transactionToEdit){
            setFormData({
                savingsFundId: transactionToEdit.savingsFundId,
                transactionType: transactionToEdit.transactionType,
                amount: transactionToEdit.amount,
                description: transactionToEdit.description,
                transactionDate: new Date(transactionToEdit.transactionDate).toISOString().split('T')[0],
                month: currentMonth
            });
        }
    }, [transactionToEdit, currentMonth]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            if (isEditMode && transactionToEdit){
                await editFundTransaction(transactionToEdit.id, formData);
            } else{
                await addFundTransaction(formData);
                console.log('Transaction successfully created');
            }
            onSuccess();
        } catch(error){
            console.error('Error adding transaction:', error); 
            alert(`Failed to ${isEditMode ? 'update' : 'add'} transaction`)
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Description</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                <label>Transaction Type</label>
                <select
                    value={formData.transactionType}
                    onChange={(e) => setFormData({...formData, transactionType: e.target.value as TransactionType})}>
                        <option value="" disabled>Select the transaction type</option>
                        <option value={'contribution'}>
                            Contribution
                        </option>
                        <option value={'expenditure'}>
                            Expenditure
                        </option>
                </select>
            </div>
            <button type="submit">
                {isEditMode ? 'Update Transaction' : 'Add Transaction'}
            </button>
        </form>
    )
}
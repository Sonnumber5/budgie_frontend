
import { useEffect, useState } from "react";
import type { AccountBalance, AccountBalanceDTO } from "../../../types";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";
import type { AccountType } from "../../../types";
import { toast } from 'react-toastify';

interface AccountBalanceFormProps{
    onSuccess: () => void;
    accountBalanceToUpdate?: AccountBalance;
}

export const AccountBalanceForm = ({ onSuccess, accountBalanceToUpdate }: AccountBalanceFormProps) => {
    const { addAccountBalance, editAccountBalance } = useAccountBalanceContext();
    const [formData, setFormData] = useState<AccountBalanceDTO>({
        accountName: '',
        accountType: '',
        balance: 0,
    })
    const isEditMode = !!accountBalanceToUpdate;

    useEffect(() => {
        if (accountBalanceToUpdate){
            setFormData({
                accountName: accountBalanceToUpdate.accountName,
                accountType: accountBalanceToUpdate.accountType,
                balance: accountBalanceToUpdate.balance
            });
        }
    }, [accountBalanceToUpdate]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            if (isEditMode && accountBalanceToUpdate){
                await editAccountBalance(accountBalanceToUpdate.id, formData)
            } else{
                await addAccountBalance(formData);
            }
            toast.success(`Successfully ${isEditMode ? 'updated' : 'created'} account balance`);
            onSuccess()
        } catch(err: any){
            toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} account balance`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Account name</label>
                <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    required
                />
            </div>
            <div>
                <label>Balance</label>
                <input
                    type="number"
                    value={formData.balance}
                    onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})}
                    required
                    min={0}
                    step="0.01"
                />
            </div>
            <div>
                <label>Account type</label>
                <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({...formData, accountType: e.target.value as AccountType})}
                    required>
                        <option value="" disabled>Select an account type</option>
                        <option value={'Asset'}>
                            Asset
                        </option>
                        <option value={'Liability'}>
                            Liability
                        </option>
                </select>
            </div>
            <button className="btn-primary" type="submit">
                {isEditMode ? 'Save' : 'Add'}
            </button>
        </form>
    )
}
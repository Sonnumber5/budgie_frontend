// IncomeForm.tsx - Form for creating or editing an income entry.
// When incomeToEdit is provided the form pre-fills and submits an update;
// otherwise it creates a new income record.
import { useEffect, useState } from "react";
import type { AccountBalance, AccountBalanceDTO, Income, IncomeDTO } from "../../../types";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";
import type { AccountType } from "../../../types";

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
            onSuccess();
        } catch(error){
            alert(`Failed to ${isEditMode ? 'update' : 'add'} account balance`)
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
                />
            </div>
            <div>
                <label>Account name</label>
                <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({...formData, accountType: e.target.value as AccountType})}>
                        <option value="" disabled>Select an account type</option>
                        <option value={'Asset'}>
                            Asset
                        </option>
                        <option value={'Liability'}>
                            Liability
                        </option>
                </select>
            </div>
            <button type="submit">
                {isEditMode ? 'Update account balance' : 'Add account balance'}
            </button>
        </form>
    )
}
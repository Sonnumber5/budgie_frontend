
import { useEffect, useState } from "react";
import type { AccountBalance, AccountBalanceDTO } from "../../../types";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";
import type { AccountType } from "../../../types";
import { toast } from 'react-toastify';
import './AccountBalanceForm.css';

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
            <div className="form-body-standard">
                <div className="form-field-group-standard">
                    <div className="form-field-standard">
                        <label>Balance</label>
                        <input
                            className="input-field-standard"
                            type="number"
                            value={formData.balance}
                            onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})}
                            required
                            min={0}
                            step="0.01"
                        />
                    </div>
                    <div className="form-field-standard">
                        <label>Account type</label>
                        <div className="account-type-toggle">
                            <button
                                type="button"
                                className={`account-type-btn asset ${formData.accountType === 'Asset' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, accountType: 'Asset'})}>
                                Asset
                            </button>
                            <button
                                type="button"
                                className={`account-type-btn liability ${formData.accountType === 'Liability' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, accountType: 'Liability'})}>
                                Liability
                            </button>
                        </div>
                    </div>
                    <div className="form-field-standard">
                        <label>Account name</label>
                        <input
                            className="input-field-standard"
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                            required
                        />
                    </div>
                </div>
            </div>
            <button className="btn-primary" type="submit">
                {isEditMode ? 'Save' : 'Add'}
            </button>
        </form>
    )
}
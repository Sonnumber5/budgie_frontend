import { useEffect, useState } from "react";
import type { SavingsFundDTO, SavingsFund } from "../../../types";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";
import { useBudgetContext } from "../../../context/BudgetContext";

interface FundFormProps{
    onSuccess: () => void;
    fundToEdit?: SavingsFund;
}

export const FundForm = ({ onSuccess, fundToEdit }: FundFormProps) => {
    const { addSavingsFund, editSavingsFund } = useSavingsFundContext();
    const [formData, setFormData] = useState<SavingsFundDTO>({
        name: '',
        goal: 1,
    });
    const isEditMode = !!fundToEdit;

    useEffect(() => {
        if (fundToEdit){
            setFormData({
                name: fundToEdit.name,
                goal: fundToEdit.goal,
            });
        }
    }, [fundToEdit]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            if (isEditMode && fundToEdit){
                await editSavingsFund(fundToEdit.id, formData)
            } else{
                await addSavingsFund(formData);
            }
            onSuccess();
        } catch(err: any){
            alert(err?.message || `Failed to ${isEditMode ? 'update' : 'add'} savings fund`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
            </div>
            <div>
                <label>Goal</label>
                <input
                    type="number"
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: Number(e.target.value)})}
                    required
                />
            </div>
            <button type="submit">
                {isEditMode ? 'Update Fund' : 'Add Fund'}
            </button>
        </form>
    )
}
import { useEffect, useState } from "react";
import type { SavingsFundDTO, SavingsFund } from "../../../types";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";
import { toast } from 'react-toastify';

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
                await editSavingsFund(fundToEdit.id, formData);
            } else{
                await addSavingsFund(formData);
            }
            toast.success(`Successfully ${isEditMode ? 'updated' : 'created'} savings fund`);
            onSuccess();
        } catch(err: any){
            toast.error(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'add'} savings fund`);
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
                    min={0}
                    step="0.01"
                />
            </div>
            <button className="btn-primary" type="submit">
                {isEditMode ? 'Update Fund' : 'Add Fund'}
            </button>
        </form>
    )
}
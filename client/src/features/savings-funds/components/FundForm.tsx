import { useEffect, useState } from "react";
import type { SavingsFundDTO, SavingsFund } from "../../../types";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";
import { toast } from 'react-toastify';
import { FundIconsArray } from "../../../images/FundIcons";
import { RenderIcon } from "../../../utils/RenderIcon";

interface FundFormProps{
    onSuccess: () => void;
    fundToEdit?: SavingsFund;
}

// Form for creating or editing a savings fund; switches between create and edit mode based on whether fundToEdit is provided.
export const FundForm = ({ onSuccess, fundToEdit }: FundFormProps) => {
    const { addSavingsFund, editSavingsFund, isLoading } = useSavingsFundContext();
    const [formData, setFormData] = useState<SavingsFundDTO>({
        name: '',
        goal: 0,
        icon: ''
    });

    const isEditMode = !!fundToEdit;

    useEffect(() => {
        if (fundToEdit){
            setFormData({
                name: fundToEdit.name,
                goal: fundToEdit.goal,
                icon: fundToEdit.icon
            });
        }
    }, [fundToEdit]);

    // Submits the form to create or update a savings fund, then calls onSuccess on completion.
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

    const selectIcon = () => {
        return (
            <div className="form-field-standard">
                <label>Icon: <RenderIcon icon={formData.icon}/></label>
                <select
                    className="select-field-standard"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                >
                    <option value="">Select an icon</option>
                    {FundIconsArray.map((label) => (
                        <option key={label} value={label}>
                            {label}
                        </option>
                    ))}
                    
                </select>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-body-standard">
                <div className="form-field-group-standard">
                    <div className="form-field-standard">
                        <label>Name</label>
                        <input
                            className="input-field-standard"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-field-standard">
                        <label>Goal</label>
                        <div className="currency-input-wrapper">
                            <span>$</span>
                            <input
                                className="input-field-standard"
                                type="number"
                                value={formData.goal === 0 ? '' : formData.goal}
                                onChange={(e) => setFormData({...formData, goal: Number(e.target.value)})}
                                required
                                min={0}
                                step="0.01"
                            />
                        </div>
                    </div>
                    {selectIcon()}
                </div>
            </div>
            <div className="multiple-form-btns">
                <button className="btn-primary-modal" type="submit" disabled={isLoading}>
                    {isLoading
                    ? (isEditMode ? 'Updating...' : 'Adding...')
                    : (isEditMode ? 'Update Fund' : 'Add Fund')
                    }
                </button>
            </div>
        </form>
    )
}
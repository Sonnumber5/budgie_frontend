import './modal.css'

interface ConfirmModalProps{
    isOpen: boolean;
    onClose: () => void;
    confirmAction: () => void
}

// Renders a confirmation modal with Cancel and Confirm buttons; returns null when closed.
export const ConfirmModal = ({ isOpen, onClose, confirmAction }: ConfirmModalProps) => {
    if (!isOpen){
        return null;
    }
    return (
        <div className="modal-overlay" onClick={onClose}>
                <div className='confirm-modal-btns'>
                    <button className='btn-primary-modal' onClick={onClose}>Cancel</button>
                    <button className='btn-danger-modal' onClick={() => {confirmAction(); onClose}}>Confirm</button>
                </div>
        </div>
    )
}
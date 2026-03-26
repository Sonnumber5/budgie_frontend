import './Modal.css'

interface ConfirmModalProps{
    isOpen: boolean;
    onClose: () => void;
    confirmAction: () => void
}

export const ConfirmModal = ({ isOpen, onClose, confirmAction }: ConfirmModalProps) => {
    if (!isOpen){
        return null;
    }
    return (
        <div className="modal-overlay" onClick={onClose}>
            <button onClick={() => {confirmAction(); onClose}}>Confirm</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}
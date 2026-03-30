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
            <button className='btn-danger' onClick={() => {confirmAction(); onClose}}>Confirm</button>
            <button className='btn-secondary' onClick={onClose}>Cancel</button>
        </div>
    )
}
interface ConfirmButtonsProps {
    confirmAction: () => void,
    cancelAction: () => void
}

export const ConfirmButtons = ({confirmAction, cancelAction}: ConfirmButtonsProps) => {
    return (
        <>
            <button onClick={() => { confirmAction(); cancelAction() }} className="btn-primary" type="button">Confirm</button>
            <button onClick={() => { cancelAction() }} className="btn-secondary" type="button">Cancel</button>
        </>
    )
}
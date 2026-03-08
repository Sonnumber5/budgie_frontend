import { useSavingsFundContext } from "../context/SavingsFundContext";
import { useState } from "react";
import './SavingsFundPage.css';
import { Fund } from "../features/savings-funds/components/Fund";
import { Modal } from "../components/modal";

export const SavingsFundPage = () => {
    const { activeSavingsFunds, isLoading, error } = useSavingsFundContext();
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return(
        <div className="savings-fund-page">
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Savings fund form">
                Add fund form later
            </Modal>
            <button onClick={() => {setIsModalOpen(true)}}>
                +
            </button>
            <div className="fund-list">
            {activeSavingsFunds.map((fund) => (
                <Fund key={fund.id} fund={fund}/>
            ))}
            </div>
        </div>
    )
}
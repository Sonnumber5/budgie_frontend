import { useState } from "react";
import type { SavingsFund } from "../../../types";
import { formatCurrency } from "../../../utils/formatCurrency";
import './FundPreview.css';
import { Modal } from "../../../components/modal";
import { FundTransactionForm } from "../../fund-transactions/components/FundTransactionForm";
import { RenderIcon } from "../../../utils/RenderIcon";

interface SavingsFundProps{
    fund: SavingsFund;
}

// Renders a compact read-only preview of a savings fund showing its name, balance vs. goal, and a progress bar.
export const FundPreview = ({ fund }: SavingsFundProps) => {
    const [ isTransactionModalOpen, setIsTransactionModalOpen ] = useState(false);

    const progress = Math.min((fund.balance / fund.goal) * 100, 100);

    return (
        <div className="fund-preview">
                <Modal isOpen={isTransactionModalOpen} onClose={() => {setIsTransactionModalOpen(false)}} title="AddTransaction">
                    <FundTransactionForm fundId={fund.id} onSuccess={() => {setIsTransactionModalOpen(false)}}/>
                </Modal>
            <div className="fund-preview-header">
                <div><RenderIcon icon={fund.icon}/></div>
                <p>{fund.name}</p>
            </div>
            <div className="fund-preview-main-content">
                <div className="progress-bar">
                    {progress > 0 && <div className="progress-fill fund-preview" style={{ width: `${progress}%` }}/>}
                </div>
                <p>
                    <span>{formatCurrency(Number(fund.balance))}</span>
                    <span className="text-fraction"> / {formatCurrency(Number(fund.goal))}</span>
                </p>
            </div>
            <div className="fund-preview-btn">
                <button className="btn-primary" onClick={() => {setIsTransactionModalOpen(true)}}>Add Transaction</button>
            </div>
        </div>
    )
}
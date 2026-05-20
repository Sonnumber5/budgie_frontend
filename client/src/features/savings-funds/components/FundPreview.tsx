import type { SavingsFund } from "../../../types";
import { formatCurrency } from "../../../utils/formatCurrency";
import './FundPreview.css';

interface SavingsFundProps{
    fund: SavingsFund;
}

// Renders a compact read-only preview of a savings fund showing its name, balance vs. goal, and a progress bar.
export const FundPreview = ({ fund }: SavingsFundProps) => {

    
    const progress = Math.min((fund.balance / fund.goal) * 100, 100);

    return (
        <div className="fund-preview">
            <div className="fund-preview-header">
                <div>ICON</div>
                <div>{fund.name}</div>
            </div>
            <div className="fund-preview-main-content">
                <p>
                    <span>{formatCurrency(Number(fund.balance))}</span>
                    <span className="text-fraction"> / {formatCurrency(Number(fund.goal))}</span>
                </p>
                <div className="progress-bar">
                    {progress > 0 && <div className="progress-fill fund-preview" style={{ width: `${progress}%` }}/>}
                </div>
            </div>
            <div className="fund-preview-btn">
                <button className="btn-primary">Add Transaction</button>
            </div>
        </div>
    )
}
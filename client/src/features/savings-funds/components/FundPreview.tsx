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
            <div className="fund-preview-info">
                <p>{fund.name}</p>
                <p>{`${formatCurrency(Number(fund.balance))} / ${formatCurrency(Number(fund.goal))}`}</p>
            </div>
            <div className="progress-bar">
                <div className="progress-fill fund-preview" style={{ width: `${progress}%` }}/>
            </div>
        </div>
    )
}
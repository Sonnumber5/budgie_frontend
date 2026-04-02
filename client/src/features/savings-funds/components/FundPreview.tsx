import type { SavingsFund } from "../../../types";
import './FundPreview.css';

interface SavingsFundProps{
    fund: SavingsFund;
}

export const FundPreview = ({ fund }: SavingsFundProps) => {
    const progress = Math.min((fund.balance / fund.goal) * 100, 100);

    return (
        <div className="fund-preview">
            <div className="fund-preview-info">
                <p>{fund.name}</p>
                <p>{`$${Number(fund.balance).toFixed(2)} / $${Number(fund.goal).toFixed(2)}`}</p>
            </div>
            <div className="fund-preview-progress-bar">
                <div className="fund-preview-progress-fill" style={{ width: `${progress}%` }}/>
            </div>
        </div>
    )
}
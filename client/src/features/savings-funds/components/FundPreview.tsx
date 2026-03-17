import type { SavingsFund } from "../../../types";
import './Fund.css';

interface SavingsFundProps{
    fund: SavingsFund;
}

export const FundPreview = ({ fund }: SavingsFundProps) => {
    return (
        <div className="savings-fund">
            <div className="fund-info">
                <h3 >{fund.name}</h3>
                
                <p>{`Goal: $${Number(fund.goal).toFixed(2)}`}</p>
                <div>
                    <p>{`Balance: $${Number(fund.balance).toFixed(2)}`}</p>
                </div>
            </div>
        </div>
    )
}
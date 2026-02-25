import './Dashboard.css';
import { useDashboardContext } from '../context/DashboardContext';
import { MonthPicker } from '../components/DatePicker';

export const Dashboard = () => {
    const { incomeTotal, expenseTotal, currentRemaining, isLoading  } = useDashboardContext();

    return (
        <div className="dashboard">
            <div className='month-section'>
                <MonthPicker/>
            </div>
            <div className='totals-section'>
                <div className='income-total'>
                    {isLoading ? 'Loading...' : `Total income: ${incomeTotal}`}
                </div>
                <div className='expenses-total'>
                    Total expenses: ${expenseTotal}
                </div>
                <div className='remaining-total'>
                    Total remaining: ${currentRemaining}
                </div>
                <div className='net-worth-total'>
                    Section 4
                </div>
            </div>
            <div className='budget-funds-balance-sections'>
                <div className='budget-section'>

                </div>
                <div className='balances-categories-section'>
                    <div className='balances-section'>

                    </div>
                    <div className='categories-section'>

                    </div>
                </div>
            </div>
        </div>
    )
}
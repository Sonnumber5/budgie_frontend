import { useExpenseContext } from "../../../context/ExpenseContext";
import type { Expense } from "../../../types";
import './ExpenseItem.css'

interface ExpenseItemProps{
    expense: Expense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    const { removeExpense } = useExpenseContext();
    
    return (
        <div className="expense-item">
            <div>{expense.vendor}</div>
            <div>{expense.description}</div>
            <div>${Number(expense.amount).toFixed(2)}</div>
            <div>{new Date(expense.expenseDate).toLocaleDateString()}</div>
            <div>
                <button onClick={() => {}}>
                    Edit
                </button>
                <button onClick={() => removeExpense(expense.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
};
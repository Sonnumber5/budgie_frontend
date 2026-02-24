import { useExpenseContext } from "../../../context/ExpenseContext";
import type { Expense } from "../../../types";

interface ExpenseItemProps{
    expense: Expense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    const { removeExpense } = useExpenseContext();
    return (
        <tr>
            <td>{expense.vendor}</td>
            <td>{expense.description}</td>
            <td>${Number(expense.amount).toFixed(2)}</td>
            <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
            <td>
                <button onClick={() => {}}>
                    Edit
                </button>
                <button onClick={() => removeExpense(expense.id)}>
                    Delete
                </button>
            </td>
        </tr>
    );
};
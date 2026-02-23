import { useExpenseContext } from "../../../context/ExpenseContext";
import type { Expense } from "../../../types";

interface ExpenseItemProps{
    expense: Expense;
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
    const { removeExpense } = useExpenseContext();
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-3">{expense.vendor}</td>
            <td className="px-4 py-3">{expense.description}</td>
            <td className="px-4 py-3">${Number(expense.amount).toFixed(2)}</td>
            <td className="px-4 py-3">{new Date(expense.expenseDate).toLocaleDateString()}</td>
            <td className="px-4 py-3 flex gap-2">
                <button onClick={() => {}}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit
                </button>
                <button onClick={() => removeExpense(expense.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                </button>
            </td>
        </tr>
    );
};
import { ExpenseItem } from "./ExpenseItem";
import type { Expense } from "../../../types";
import { useState } from "react";

interface ExpenseCategoryGroupProps {
    categoryName: string;
    expenses: Expense[];
}

export const ExpenseCategoryGroup = ({categoryName, expenses}: ExpenseCategoryGroupProps) => {
    const [isOpen, setIsOpen] = useState(false);

    let total = 0;
    for (const e of expenses){
        total += e.amount;
    }

    return (
        <div className="border rounded-lg mb-3">
            <button
                onClick={() => {setIsOpen(prev => !prev)}}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                    <span className="font-semibold">{categoryName}</span>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">${total.toFixed(2)}</span>
                        <span>{isOpen ? '▲' : '▼'}</span>
                    </div>
            </button>
            {isOpen && (
                <div className="p-4">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-600 uppercase text-xs border-b">
                            <tr>
                                <th className="pb-2">Vendor</th>
                                <th className="pb-2">Description</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {expenses.map(expense => (
                                <ExpenseItem key={expense.id} expense={expense} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
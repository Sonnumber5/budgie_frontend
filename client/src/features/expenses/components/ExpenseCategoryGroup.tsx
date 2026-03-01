import { ExpenseItem } from "./ExpenseItem";
import type { Expense } from "../../../types";
import { useState } from "react";

interface ExpenseCategoryGroupProps {
    categoryName: string;
    expenses: Expense[];
}

export const ExpenseCategoryGroup = ({categoryName, expenses}: ExpenseCategoryGroupProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div>
            <button
                onClick={() => {setIsOpen(prev => !prev)}}
                >
                    <span>{categoryName}</span>
                    <div>
                        <span>${total.toFixed(2)}</span>
                        <span>{isOpen ? '▲' : '▼'}</span>
                    </div>
            </button>
            {isOpen && (
                <div>
                    <div>
                        <div>Vendor</div>
                        <div>Description</div>
                        <div>Amount</div>
                        <div>Date</div>
                        <div>Actions</div>
                    </div>
                    <div>
                        {expenses.map(expense => (
                            <ExpenseItem key={expense.id} expense={expense} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
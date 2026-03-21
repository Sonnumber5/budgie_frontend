
import { useExpenseContext } from "../../../context/ExpenseContext";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";
import { useIncomeContext } from "../../../context/IncomeContext";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";

export const useDashboard = () => {
    const { expenseSum } = useExpenseContext();    
    const { incomeSum } = useIncomeContext();
    const { assetsTotal, liabilitiesTotal } = useAccountBalanceContext();
    const { monthlyContributionSum } = useFundTransactionContext();

    const financialOverview = Number(assetsTotal) - Number(liabilitiesTotal);
    const currentRemaining = Number(incomeSum) - Number(expenseSum) - Number(monthlyContributionSum);
    const monthlyTotal = Number(incomeSum) - Number(expenseSum);

    return { financialOverview, currentRemaining, monthlyTotal }
}
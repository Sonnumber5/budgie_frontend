
import { useExpenseContext } from "../../../context/ExpenseContext";
import { useAccountBalanceContext } from "../../../context/AccountBalanceContext";
import { useIncomeContext } from "../../../context/IncomeContext";
import { useFundTransactionContext } from "../../../context/FundTransactionContext";
import { useSavingsFundContext } from "../../../context/SavingsFundContext";

// Hook that computes high-level financial summary values from context state for the dashboard.
export const useDashboard = () => {
    const { expenseSum } = useExpenseContext();    
    const { incomeSum } = useIncomeContext();
    const { assetsTotal, liabilitiesTotal } = useAccountBalanceContext();
    const { monthlyContributionSum } = useFundTransactionContext();
    const { savingsTotal } = useSavingsFundContext();

    const financialOverview = Number(assetsTotal) - Number(liabilitiesTotal) - Number(savingsTotal);
    const currentRemaining = Number(incomeSum) - Number(expenseSum) - Number(monthlyContributionSum);
    const monthlyTotal = Number(incomeSum) - Number(expenseSum);

    return { financialOverview, currentRemaining, monthlyTotal }
}
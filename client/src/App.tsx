// App.tsx - Root application component
// Sets up global context providers and client-side routing.
// Context provider nesting order: AuthProvider > DateProvider > BudgetProvider.
// ExpenseProvider and IncomeProvider are scoped to their respective routes
// so their data only loads when those pages are visited.
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DateProvider } from './context/DateContext';;
import { ExpenseProvider } from './context/ExpenseContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { Dashboard } from './pages/Dashboard';
import { Navbar } from './components/navbar';
import { ExpensesPage } from './pages/ExpensesPage';
import { IncomeProvider } from './context/IncomeContext';
import { IncomePage } from './pages/IncomePage';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import { BudgetOverview } from './features/budget/components/BudgetOverview';
import { SavingsFundProvider } from './context/SavingsFundContext';
import { SavingsFundPage } from './pages/SavingsFundPage';

function App() {
  // DefaultRoute redirects the root "/" path based on authentication status.
  // Authenticated users go to /dashboard; guests are sent to /login.
  const DefaultRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return null; // add spinner later on

    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};
  return (
    <BrowserRouter>
      <AuthProvider>
        <DateProvider>
          <SavingsFundProvider>
            <ExpenseProvider>
              <DashboardProvider>
                <BudgetProvider>
                <Navbar/>
                  <Routes>
                  <Route path="/" element={<DefaultRoute/>}/>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/expenses" element={
                      <ProtectedRoute>
                          <ExpensesPage/>
                      </ProtectedRoute>
                    }/>
                    <Route path="/income" element={
                      <ProtectedRoute>
                        <IncomeProvider>
                          <IncomePage/>
                        </IncomeProvider>
                      </ProtectedRoute>
                    }/> 
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                          <Dashboard/>
                      </ProtectedRoute>
                    }/>
                    <Route path="/savings-funds" element={
                      <ProtectedRoute>
                          <SavingsFundPage/>
                      </ProtectedRoute>
                    }/>
                  </Routes>
                </BudgetProvider>
              </DashboardProvider>
            </ExpenseProvider>
          </SavingsFundProvider>
        </DateProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
